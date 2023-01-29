import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const rotateNinety = [Math.PI / 2, 0, Math.PI / 2]; // rotates ninety degrees vertically
const left = -1;
let offset = 0; // offset for the plates not to stack on one another
const colors = ["red", "navy",  "goldenRod", "green", "white"];
// Barbell constants
const barRadius = 0.1;
const barHeight = 7;
const capRadius = 0.3;
const capHeight = 0.25;
const pinRadius = 0.2;
const pinHeight = 3;
const barColor = "#747070"; // Darkish grey
const barbellPushBack = -5;
// Weight plate constants
const barbellBandHeight = 0.025;
const bandColor = "white"; 
const barbellHeightSegments = 1;
const barbellPlateStart = barHeight / 2 + capHeight;

const startingPlateRadius = 1.25;
const startingPlateHeight = 0.375;
function WeightPlate(props) {
  return (
    <group>
      {/*LEFT BAND*/}
      <mesh
        position={[
          (barbellPlateStart + props.offset + barbellBandHeight) * props.side,
          0,
          barbellPushBack,
        ]}
        rotation={rotateNinety}
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[
            props.plateRadius + 0.01,
            props.plateRadius + 0.01,
            barbellBandHeight,
            64,
            barbellHeightSegments,
            true,
          ]}
        />
        <meshLambertMaterial attach={"material"} color={bandColor} />
      </mesh>
      {/*PLATE*/}
      <mesh
        position={[
          (barbellPlateStart + props.offset + props.plateHeight / 2) *
            props.side,
          0,
          barbellPushBack,
        ]}
        rotation={rotateNinety}
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[props.plateRadius, props.plateRadius, props.plateHeight, 64]}
        />
        <meshLambertMaterial attach={"material"} color={props.color} />
      </mesh>
      {/*RIGHT BAND*/}
      <mesh
        position={[
          (barbellPlateStart +
            props.offset +
            (props.plateHeight - barbellBandHeight / 2)) *
            props.side,
          0,
          barbellPushBack,
        ]}
        rotation={rotateNinety}
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[
            props.plateRadius + 0.01,
            props.plateRadius + 0.01,
            barbellBandHeight,
            64,
            barbellHeightSegments,
            true,
          ]}
        />
        <meshLambertMaterial attach={"material"} color={bandColor} />
      </mesh>
    </group>
  );
}
function Barbell() {
  return (
    <group>
      {/*CENTER BAR*/}
      <mesh position={[0, 0, barbellPushBack]} rotation={rotateNinety}>
        <cylinderBufferGeometry
          attach="geometry"
          args={[barRadius, barRadius, barHeight, 64]}
        />
        <meshLambertMaterial attach={"material"} color={barColor} />
      </mesh>
      {/*END CAPS*/}
      <mesh
        position={[(barHeight / 2 + capHeight / 2) * left, 0, barbellPushBack]}
        rotation={rotateNinety}
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[capRadius, capRadius, capHeight, 64]}
        />
        <meshLambertMaterial attach={"material"} color={barColor} />
      </mesh>
      <mesh
        position={[barHeight / 2 + capHeight / 2, 0, barbellPushBack]}
        rotation={rotateNinety}
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[capRadius, capRadius, capHeight, 64]}
        />
        <meshLambertMaterial attach={"material"} color={barColor} />
      </mesh>
      {/*WEIGHT PINS*/}
      {/*LEFT PIN*/}
      <mesh
        position={[
          (barHeight / 2 + capHeight / 2 + pinHeight / 2) * left,
          0,
          barbellPushBack,
        ]}
        rotation={rotateNinety}
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[pinRadius, pinRadius, pinHeight, 64]}
        />
        <meshLambertMaterial attach={"material"} color={barColor} />
      </mesh>
      {/*RIGHT PIN*/}
      <mesh
        position={[
          barHeight / 2 + capHeight / 2 + pinHeight / 2,
          0,
          barbellPushBack,
        ]}
        rotation={rotateNinety}
      >
        <cylinderBufferGeometry
          attach="geometry"
          args={[pinRadius, pinRadius, pinHeight, 64]}
        />
        <meshLambertMaterial attach={"material"} color={barColor} />
      </mesh>
    </group>
  );
}
export function WeightVisualizer(props) {
  return (
    <Canvas>
      <color
        attach={"background"}
        args={[props.blackWeights ? "white" : "black"]}
      />
      <OrbitControls makeDefault="true" />

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <spotLight position={[-10, 15, 10]} angle={0.3} />
      <Barbell />
      {props.weights.map((input, index) => {
        if (index === 0) offset = 0; // reset offset when the weight inputs change. Prevents stacking
        let array = [];
        let side = left; // always start here. Arbitrary
        for (let i = 0; i < input.amount; i++) {
          let plateRadius = startingPlateRadius * 0.9 ** index;
          let plateHeight = startingPlateHeight * 0.9 ** index;
          array = [
            ...array,
            <WeightPlate
              key={`${index}:${i}`}
              plateRadius={plateRadius}
              plateHeight={plateHeight}
              side={side}
              color={colors[index % colors.length]}
              offset={offset}
            />,
          ];
          if (i % 2 === 1) offset += plateHeight; // update height after every two plates
          side *= -1;
        }
        return array;
      })}
    </Canvas>
  );
}
