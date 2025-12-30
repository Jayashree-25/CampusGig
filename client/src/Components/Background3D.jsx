import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function Network() {
  const group = useRef()
  const mouse3D = useRef(new THREE.Vector3())
  const lastMouse = useRef(new THREE.Vector3())

  const nodes = useMemo(() => {
    return Array.from({ length: 160 }, () => ({
      base: new THREE.Vector3(
        (Math.random() - 0.5) * 12,   // 🔥 wider spread
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 4
      ),
      offset: Math.random() * Math.PI * 2
    }))
  }, [])

  const positions = useMemo(() => new Float32Array(nodes.length * 3), [nodes])

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime()

    mouse3D.current.lerp(
      new THREE.Vector3(mouse.x * 6, mouse.y * 4, 0),
      0.22
    )

    const mouseSpeed = mouse3D.current.distanceTo(lastMouse.current)
    lastMouse.current.copy(mouse3D.current)

    // Fast but smooth global motion
    group.current.rotation.y = t * 0.14
    group.current.rotation.x = Math.sin(t * 0.7) * 0.14

    nodes.forEach((n, i) => {
      const p = n.base.clone()

      // Fast wave (no squeeze)
      p.z += Math.sin(t * 4.2 + n.offset) * 0.5

      // Strong ripple
      const dist = p.distanceTo(mouse3D.current)
      const ripple = Math.sin(dist * 5 - t * 26) * mouseSpeed * 3.2
      p.z += ripple

      // Soft attraction (keeps web wide)
      const influence = Math.max(0, 6 - dist)
      p.add(
        mouse3D.current.clone().sub(p).multiplyScalar(influence * 0.18)
      )

      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
    })
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={nodes.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.055} color="#2dd4bf" transparent opacity={0.9} />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={nodes.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </lineSegments>
    </group>
  )
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={1} />
        <Network />
      </Canvas>
    </div>
  )
}
