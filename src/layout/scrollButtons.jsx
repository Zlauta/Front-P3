import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./scrollButtons.css";

export default function ScrollButtons() {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Mostrar flecha arriba si no estás en el top
      setShowUp(scrollTop > 100);

      // Mostrar flecha abajo si no estás en el bottom
      setShowDown(scrollTop + windowHeight < docHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // inicializar estado

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-buttons">
      {showUp && (
        <button
          className="scroll-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Ir arriba"
        >
          <FaArrowUp />
        </button>
      )}

      {showDown && (
        <button
          className="scroll-btn"
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
          aria-label="Ir abajo"
        >
          <FaArrowDown />
        </button>
      )}
    </div>
  );
}
