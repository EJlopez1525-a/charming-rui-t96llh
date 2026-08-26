import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

function WindowModel({
  width,
  height,
  materialColor,
  windowType,
  glassType,
  thicknessMm,
  hasGrid,
}) {
  const w = width / 100;
  const h = height / 100;
  const profileThick = 0.05;
  const depth = 0.08;

  let glassColor = "#aaddff";
  let glassOpacity = 0.4;
  let glassRoughness = 0.1;
  if (glassType === "polarizado") {
    glassColor = "#112233";
    glassOpacity = 0.7;
  } else if (glassType === "esmerilado") {
    glassColor = "#ffffff";
    glassOpacity = 0.85;
    glassRoughness = 0.6;
  }

  return (
    <group>
      {/* Marco Exterior Común */}
      <mesh position={[-w / 2 + profileThick / 2, 0, 0]}>
        <boxGeometry args={[profileThick, h, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[w / 2 - profileThick / 2, 0, 0]}>
        <boxGeometry args={[profileThick, h, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[0, h / 2 - profileThick / 2, 0]}>
        <boxGeometry args={[w - profileThick * 2, profileThick, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[0, -h / 2 + profileThick / 2, 0]}>
        <boxGeometry args={[w - profileThick * 2, profileThick, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Fija */}
      {windowType === "fija" && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry
            args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
          />
          <meshPhysicalMaterial
            color={glassColor}
            transparent
            opacity={glassOpacity}
            roughness={glassRoughness}
            transmission={0.9}
          />
        </mesh>
      )}

      {/* Corrediza */}
      {windowType === "corrediza" && (
        <group>
          <mesh position={[-w / 4, 0, -0.02]}>
            <boxGeometry
              args={[w / 2 - profileThick, h - profileThick * 2, 0.012]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
          <mesh position={[w / 4, 0, 0.02]}>
            <boxGeometry
              args={[w / 2 - profileThick, h - profileThick * 2, 0.012]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
        </group>
      )}

      {/* Abatible */}
      {windowType === "abatible" && (
        <group position={[-w / 2 + profileThick, 0, 0]} rotation={[0, 0.4, 0]}>
          <mesh position={[w / 2, 0, 0]}>
            <boxGeometry
              args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
        </group>
      )}

      {/* Proyectable */}
      {windowType === "proyectable" && (
        <group position={[0, h / 2 - profileThick, 0]} rotation={[-0.3, 0, 0]}>
          <mesh position={[0, -h / 2, 0]}>
            <boxGeometry
              args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
        </group>
      )}

      {/* Celosía */}
      {windowType === "celosia" && (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry
              args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
            />
          </mesh>
        </group>
      )}

      {/* Cuadrículas */}
      {hasGrid && windowType === "fija" && (
        <group position={[0, 0, 0.01]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[w - profileThick * 2, 0.015, 0.01]} />
            <meshStandardMaterial color={materialColor} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.015, h - profileThick * 2, 0.01]} />
            <meshStandardMaterial color={materialColor} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function App() {
  const [width, setWidth] = useState(120);
  const [height, setHeight] = useState(100);
  const [material, setMaterial] = useState(
    JSON.stringify({ price: 680, color: "#FFFFFF" })
  );
  const [windowType, setWindowType] = useState("fija");
  const [glassType, setGlassType] = useState("claro");
  const [thicknessMm, setThicknessMm] = useState("5");
  const [hasGrid, setHasGrid] = useState(false);

  const parsedMaterial = JSON.parse(material);
  const area = (width / 100) * (height / 100);

  let extraVidrio = 0;
  if (glassType === "polarizado") extraVidrio += 50;
  if (glassType === "esmerilado") extraVidrio += 80;
  if (thicknessMm === "6") extraVidrio += 40;
  if (thicknessMm === "8") extraVidrio += 90;

  let extraTipo = 0;
  if (windowType === "corrediza") extraTipo = 180;
  if (windowType === "abatible") extraTipo = 300;
  if (windowType === "proyectable") extraTipo = 250;
  if (windowType === "celosia") extraTipo = 350;
  if (hasGrid && windowType === "fija") extraTipo += 100;

  const costoTotal = area * parsedMaterial.price + extraVidrio + extraTipo;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "sans-serif",
        margin: 0,
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "20px",
          background: "#f8f9fa",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2>📐 Cotizador Vidriería</h2>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <b>Línea / Material:</b>
          </label>
          <br />
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <optgroup label="uPVC Blanco">
              <option value={JSON.stringify({ price: 680, color: "#FFFFFF" })}>
                S60 - Blanco (Q680 / m²)
              </option>
              <option value={JSON.stringify({ price: 750, color: "#FFFFFF" })}>
                S80 - Blanco (Q750 / m²)
              </option>
              <option value={JSON.stringify({ price: 800, color: "#FFFFFF" })}>
                Estructuras - Blanco (Q800 / m²)
              </option>
            </optgroup>
            <optgroup label="uPVC Imitación Madera">
              <option value={JSON.stringify({ price: 980, color: "#8B5A2B" })}>
                S60 - Madera (Q980 / m²)
              </option>
              <option value={JSON.stringify({ price: 1060, color: "#8B5A2B" })}>
                S80 - Madera (Q1060 / m²)
              </option>
              <option value={JSON.stringify({ price: 1100, color: "#8B5A2B" })}>
                Estructuras - Madera (Q1100 / m²)
              </option>
            </optgroup>
            <optgroup label="uPVC Negro">
              <option value={JSON.stringify({ price: 980, color: "#1E1E1E" })}>
                S60 - Negro (Q980 / m²)
              </option>
              <option value={JSON.stringify({ price: 1060, color: "#1E1E1E" })}>
                S80 - Negro (Q1060 / m²)
              </option>
              <option value={JSON.stringify({ price: 1100, color: "#1E1E1E" })}>
                Estructuras - Negro (Q1100 / m²)
              </option>
            </optgroup>
            <optgroup label="Aluminio">
              <option value={JSON.stringify({ price: 2400, color: "#C0C0C0" })}>
                Aluminio Euro (Q2400 / m²)
              </option>
            </optgroup>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <b>Tipo de Ventana:</b>
          </label>
          <br />
          <select
            value={windowType}
            onChange={(e) => setWindowType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="fija">Ventana Fija</option>
            <option value="corrediza">Corrediza (2 Hojas)</option>
            <option value="abatible">Abatible</option>
            <option value="proyectable">Proyectable</option>
            <option value="celosia">Celosía</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Ancho: {width} cm</label>
          <input
            type="range"
            min="50"
            max="300"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Alto: {height} cm</label>
          <input
            type="range"
            min="50"
            max="300"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <b>Tipo de Vidrio:</b>
          </label>
          <br />
          <select
            value={glassType}
            onChange={(e) => setGlassType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="claro">Claro / Transparente</option>
            <option value="polarizado">Polarizado</option>
            <option value="esmerilado">Esmerilado</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <b>Grosor del Vidrio:</b>
          </label>
          <br />
          <select
            value={thicknessMm}
            onChange={(e) => setThicknessMm(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="5">5 mm</option>
            <option value="6">6 mm</option>
            <option value="8">8 mm</option>
          </select>
        </div>

        {windowType === "fija" && (
          <div style={{ marginBottom: "15px" }}>
            <label>
              <input
                type="checkbox"
                checked={hasGrid}
                onChange={(e) => setHasGrid(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              <b>Incluir Cuadrículas Decorativas</b>
            </label>
          </div>
        )}

        <div
          style={{
            padding: "15px",
            background: "#e3f2fd",
            borderRadius: "10px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#1565c0" }}>
            Total Estimado:
          </span>
          <br />
          <strong style={{ fontSize: "22px", color: "#0d47a1" }}>
            Q {costoTotal.toFixed(2)}
          </strong>
        </div>
      </div>

      <div style={{ flex: 1, background: "#cfd8dc" }}>
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <WindowModel
            width={width}
            height={height}
            materialColor={parsedMaterial.color}
            windowType={windowType}
            glassType={glassType}
            thicknessMm={thicknessMm}
            hasGrid={hasGrid}
          />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
          />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}
