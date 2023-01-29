import Head from "next/head";
import { NavBar } from "/components/NavBar.js";
import { WeightVisualizer } from "/components/weights";
import { WeightInputForm } from "/components/WeightInputForm";
import { useState } from "react";
import db from "/components/db.js";
import { getWeights } from "/components/getWeights";
import { useLiveQuery } from "dexie-react-hooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [weights, setWeights] = useState([{ weight: 0, amount: 0 }]);
  const [visualizerWeights, setVisualizerWeights] = useState([]);
  const [resultText, setResultText] = useState("");
  const [targetWeight, setTargetWeight] = useState(0);
  const [barWeight, setBarWeight] = useState(0);
  const [options, SetOption] = useState(0);
  const [chosenLayout, setChosenLayout] = useState("");
  const [savedLayouts, setSavedLayouts] = useState(() => {
    let ret = [];
    async function populate() {
      const lays = await db.layouts.toArray();
      if (lays.length !== 0) {
        for (let i = 0; i < lays.length; i++) {
          ret = [...ret, lays[i].name];
        }
      }
    }
    populate().then(() => {
      ret.sort();
      setSavedLayouts(ret);
      setChosenLayout(ret[0]);
    });
    return ret;
  });
  useLiveQuery(() => {
    let ret = [];
    async function populate() {
      const lays = await db.layouts.toArray();
      if (lays.length !== 0) {
        for (let i = 0; i < lays.length; i++) {
          ret = [...ret, lays[i].name];
        }
      }
    }
    populate().then(() => {
      ret.sort();
      setSavedLayouts(ret);
      // setChosenSavedLayout(ret[0]);
    });
    return ret;
  });
  // ------------------- HELPER FUNCTIONS -----------------------
  // Triggered by click on "Calculate button"
  // Takes in parameters and calculates result, updating state as necessary
  function calculateWeights(weightOptions, targetWeight, barWeight) {
    const weights = weightOptions.map((input) => {
      return { weight: input.weight * 100, amount: input.amount };
    });
    if (targetWeight < 0) {
      toast("Target weight must be positive!", {
        type: "error",
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }
    if (barWeight < 0) {
      toast("Bar weight must be positive!", {
        type: "error",
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }
    if (isNaN(targetWeight) || isNaN(barWeight)) {
      toast("Only numeric input allowed! HI", {
        type: "error",
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }
    for (let weightOption of weightOptions) {
      if (isNaN(weightOption.weight) || isNaN(weightOption.amount)) {
        toast("Only numeric input allowed! BYE", {
          type: "error",
          theme: "colored",
          autoClose: 3000,
        });
        return;
      }
      if (weightOption.weight < 0 || weightOption.amount < 0) {
        toast("Weight and Amount must be positive!", {
          type: "error",
          theme: "colored",
          autoClose: 3000,
        });
        return;
      }
    }
    if (targetWeight - barWeight === 0) {
      setResultText("No weights needed");
      setVisualizerWeights([]);
      return;
    }
    const result = getWeights(weights, (targetWeight - barWeight) * 100);
    if (!result) {
      setResultText("Can't make this weight");
      toast("Can't make weight", {
        type: "error",
        theme: "colored",
        autoClose: 3000,
      });
      setVisualizerWeights([]);
    } else {
      let newResultText = "Use ";
      let newVisualizerWeights = [];
      // sort result by descending weights
      const descendingKeys = new Map([...result.entries()].reverse());
      for (const weight of descendingKeys.keys()) {
        newResultText += `${result.get(weight)} ${weight / 100}s, `;
        newVisualizerWeights = [
          ...newVisualizerWeights,
          { weight: weight, amount: result.get(weight) },
        ];
      }
      newResultText = newResultText.slice(0, newResultText.length - 2);
      setResultText(newResultText);
      setVisualizerWeights(newVisualizerWeights);
    }
  }
  const saveCurrentLayout = () => {
    // Handles adding a new saved layout option
    const addSavedLayout = (name) => {
      let newVersion = [...savedLayouts, String(name)].sort();
      setSavedLayouts(newVersion);
      setChosenLayout(name);
    };
    let name;
    let id;
    async function saveLayout() {
      name = prompt("Enter exercise name:").toLowerCase();
      if (!name) throw new Error("No name entered");
      id = await db.layouts.add({
        name,
        weights,
        targetWeight,
        barWeight,
        resultText,
        visualizerWeights,
      });
    }
    saveLayout()
      .then(() => {
        if (name) {
          addSavedLayout(name);
          console.log(`Successfully stored ${name} with id: ${id}`);
        }
      })
      .catch((error) => {
        async function modifyLayout() {
          await db.layouts.where("name").equalsIgnoreCase(name).modify({
            weights: weights,
            targetWeight: targetWeight,
            barWeight: barWeight,
            resultText: resultText,
            visualizerWeights: visualizerWeights,
          });
        }
        if (error.name === "ConstraintError") {
          // modify existing layout
          modifyLayout()
            .then(console.log(`Modified ${name}`))
            .catch((error) =>
              console.log(`Failed to modify ${name} with error: ${error}`)
            );
        } else console.log(`Failed to add ${name} with error: ${error}`);
      });
  };
  // Handles changes in the weight inputs
  const handleInputChange = (index, name, value) => {
    let temp = [...weights];
    temp[index][name] = value;
    console.log("HERE:", name, value);
    setWeights(temp);
  };
  // Adds a weight input field
  const addWeight = () => {
    let newWeight = { weight: "", amount: "" };
    console.log("WEIGHTS:", weights);
    setWeights([...weights, newWeight]);
    console.log("WEIGHTS AFTER: ", weights);
    console.log("BYE");
  };
  // Removes the index-th weight input field
  const removeWeight = (index) => {
    let temp = [...weights];
    temp.splice(index, 1);
    setWeights(temp);
  };
  // Loads the selected layout
  const loadSavedLayout = () => {
    async function load() {
      const exercise = chosenLayout;
      const lay = await db.layouts.where("name").equals(exercise).toArray(); // Have to convert to array or else it won't work
      setWeights(lay[0].weights);
      setTargetWeight(lay[0].targetWeight);
      setBarWeight(lay[0].barWeight);
      setResultText(lay[0].resultText);
      setVisualizerWeights(lay[0].visualizerWeights);
    }
    load().catch((error) => {
      console.log(`Unable to load: ${error}`);
    });
  };
  // // Handles adding a new saved layout option
  // const addSavedLayout = (name) => {
  //   let newVersion = [...savedLayouts, String(name)].sort();
  //   setSavedLayouts(newVersion);
  //   setChosenSavedLayout(name);
  // };
  // Deletes the selected saved layout
  const deleteSavedLayout = () => {
    async function deleteLayout() {
      const exercise = chosenLayout;
      if (exercise) {
        await db.layouts.where("name").equals(exercise).delete();
      }
    }
    deleteLayout()
      .then(() => {
        if (savedLayouts.length) {
          setChosenLayout(savedLayouts[0]);
        } else {
          setChosenLayout("");
        }
      })
      .catch((error) => {
        console.log(`Failed to delete: ${error}`);
      });
  };
  const saveLayoutClick = () => {
    saveCurrentLayout(weights);
  };
  return (
    <>
      <Head>
        <title>Weight Calc</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-screen min-h-0">
        <NavBar />
        <main className="w-full flex-grow flex flex-col items-center md:flex-row-reverse overflow-y-auto">
          <div className="w-full h-2/5 md:h-full md:w-1/2">
            <WeightVisualizer weights={visualizerWeights} />
          </div>
          <div className=" w-full px-3 flex-grow md:h-full md:w-1/2 bg-gray-400 pt-2 overflow-y-auto">
            <WeightInputForm
              inputs={weights}
              resultText={resultText}
              saveLayoutClick={saveLayoutClick}
              selectChange={setChosenLayout}
              options={savedLayouts}
              loadLayout={loadSavedLayout}
              deleteLayout={deleteSavedLayout}
              targetWeight={targetWeight}
              targetWeightChange={setTargetWeight}
              barWeight={barWeight}
              barWeightChange={setBarWeight}
              inputChange={handleInputChange}
              removeWeight={removeWeight}
              addWeight={addWeight}
              calculate={() => {
                calculateWeights(weights, targetWeight, barWeight);
              }}
              clearLayouts={() => {
                async function clearAll() {
                  // await db.delete();
                  db.open(1);
                  // console.log("Cleared database");
                  setSavedLayouts([]); // clear select options bc they're no longer saved
                }
                clearAll().then(/*console.log("Deleted all layouts") */);
              }}
            />
          </div>
        </main>
        <ToastContainer />
      </div>
    </>
  );
}
