import { AiOutlineClose } from "react-icons/ai";

export function WeightInputForm(props) {
  return (
    <div className="w-full h-full flex flex-col items-center min-h-0 overflow-y-auto">
      <div className=" min-h-[1.125rem] w-full text-center">
        <p className="text-lg pb-1 border-b border-gray-700">
          {props.resultText}
        </p>
      </div>
      <div className=" w-full flex justify-evenly md:justify-evenly flex-nowrap text-sm lg:text-lg border-b border-gray-700 py-2 mt-4">
        <button onClick={props.saveLayoutClick}>Save Layout</button>
        <div>
          <select
            className=" w-20 lg:w-32 mr-1"
            value={props.chosenOption}
            onChange={(event) => {
              props.selectChange(event.target.value);
            }}
          >
            {props.options?.map((option, index) => {
              return <option key={index}>{option}</option>;
            })}
          </select>
          <button onClick={props.loadLayout}>Load Layout</button>
        </div>
        <button onClick={props.deleteLayout}>Delete Layout</button>
      </div>
      <div className="flex flex-row items-center justify-between flex-nowrap w-full border-b border-gray-700 pb-2">
        <div className="flex flex-col items-center justify-center">
          <label className="block">Target Weight </label>
          <input
            className=" w-20 bg-gray-500 pl-1"
            value={props.targetWeight}
            onChange={(event) => {
              props.targetWeightChange(event.target.value);
            }}
          ></input>
        </div>
        <div className="flex flex-col items-center justify-center">
          <label className="block">Bar Weight</label>
          <input
            className=" w-20 bg-gray-500 pl-1"
            value={props.barWeight}
            onChange={(event) => {
              props.barWeightChange(event.target.value);
            }}
          ></input>
        </div>
      </div>
      <div className=" relative flex-grow border-b border-gray-700 w-full h-full pt-1 overflow-y-auto min-h-0">
        <div className="min-h-0 overflow-y-auto">
          {props.inputs?.map((input, index) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center justify-evenly flex-nowrap w-full"
              >
                <div className="flex flex-col items-center justify-center">
                  <label className="block">Weight</label>
                  <input
                    className=" w-20 bg-gray-500 pl-1"
                    value={input.weight}
                    onChange={(event) => {
                      props.inputChange(index, "weight", event.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <label className="block">Amount</label>
                  <input
                    className=" w-20 bg-gray-500 pl-1"
                    value={input.amount}
                    onChange={(event) => {
                      props.inputChange(index, "amount", event.target.value);
                    }}
                  ></input>
                </div>
                <AiOutlineClose
                  className="text-red-500 hover:text-white"
                  onClick={() => {
                    props.removeWeight(index);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <button
        className=" w-3/5 mt-2 bg-gray-700/50 rounded-md text-gray-900 text-lg py-1 lg:max-w-md"
        onClick={() => {
          props.addWeight();
        }}
      >
        Add Weight
      </button>
      <button
        className=" w-3/5 my-3 bg-blue-700 rounded-md text-white text-lg py-1 lg:max-w-md"
        onClick={props.calculate}
      >
        Calculate
      </button>
      <button
        className=" w-3/5 mb-2 bg-red-500/50 rounded-md text-lg text-red-900 lg:max-w-md"
        onClick={props.clearLayouts}
      >
        Clear Layouts
      </button>
    </div>
  );
}
