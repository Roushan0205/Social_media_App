import React, { useRef, useState, useEffect } from "react";
import "./Filter.css";

const TARGET_WIDTH = 800;
const TARGET_HEIGHT = 500;

export default function ImageFilterComponent() {
     const [src, setSrc] = useState(null);
     const [filterName, setFilterName] = useState("None");
     const [intensity, setIntensity] = useState(100);
     const imgRef = useRef(null);
     const fileInputRef = useRef(null);

     useEffect(() => {
          return () => {
               if (src && src.startsWith("blob:")) URL.revokeObjectURL(src);
          };
     }, [src]);

     const filters = {
          None: (v) => "none",
          Grayscale: (v) => `grayscale(${v}%)`,
          Sepia: (v) => `sepia(${v}%)`,
          Invert: (v) => `invert(${v}%)`,
          Blur: (v) => `blur(${(v / 25).toFixed(2)}px)`,
          Brightness: (v) => `brightness(${(1 + v / 100).toFixed(2)})`,
          Contrast: (v) => `contrast(${(1 + v / 80).toFixed(2)})`,
          Saturate: (v) => `saturate(${(1 + v / 40).toFixed(2)})`,
          "Hue Rotate": (v) => `hue-rotate(${Math.round((v * 360) / 100)}deg)`,
          Opacity: (v) => `opacity(${(v / 100).toFixed(2)})`,
          Vintage: (v) => `sepia(${(v * 0.7).toFixed(0)}%) contrast(${(
               1 + v / 500
          ).toFixed(2)}) saturate(${(1 - v / 400).toFixed(2)})`,
          Cool: (v) => `saturate(${(1 + v / 200).toFixed(2)}) hue-rotate(200deg)`,
          Warm: (v) => `brightness(${(1 + v / 500).toFixed(2)}) sepia(${(
               v / 300
          ).toFixed(2)}) hue-rotate(-10deg)`,
     };

     const filterList = Object.keys(filters);

     function handleFile(e) {
          const file = e.target.files?.[0];
          if (!file) return;
          if (!file.type.startsWith("image/")) {
               alert("Please upload an image file.");
               return;
          }
          const url = URL.createObjectURL(file);
          setSrc((prev) => {
               if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
               return url;
          });
     }

     function applyFilterStyle() {
          if (!filterName || !filters[filterName]) return "none";
          return filters[filterName](intensity);
     }

     function reset() {
          setSrc(null);
          setFilterName("None");
          setIntensity(100);
          if (fileInputRef.current) fileInputRef.current.value = null;
     }

     function drawImageCover(ctx, img, dx, dy, dWidth, dHeight) {
          const sw = img.naturalWidth || img.width;
          const sh = img.naturalHeight || img.height;
          const sourceRatio = sw / sh;
          const targetRatio = dWidth / dHeight;
          let sx = 0;
          let sy = 0;
          let sWidth = sw;
          let sHeight = sh;

          if (sourceRatio > targetRatio) {

               sHeight = sh;
               sWidth = Math.round(sh * targetRatio);
               sx = Math.round((sw - sWidth) / 2);
               sy = 0;
          } else {

               sWidth = sw;
               sHeight = Math.round(sw / targetRatio);
               sx = 0;
               sy = Math.round((sh - sHeight) / 2);
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
     }

     async function downloadImage() {
          if (!imgRef.current) return;
          const img = imgRef.current;

          const canvas = document.createElement("canvas");
          canvas.width = TARGET_WIDTH;
          canvas.height = TARGET_HEIGHT;
          const ctx = canvas.getContext("2d");

          const cssFilter = applyFilterStyle();
          try {
               ctx.filter = cssFilter === "none" ? "none" : cssFilter;
          } catch (err) {
               console.warn("ctx.filter not supported for this filter string:", cssFilter, err);
               ctx.filter = "none";
          }

          drawImageCover(ctx, img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = `filtered-image-${Date.now()}.png`;
          a.click();
     }

     return (
          <div className="if-root">
               <header className="if-header">
                    <h1 className="if-title">Image Filter Studio</h1>
                    <p className="if-sub">Upload a photo, apply filters, adjust intensity, and download.</p>
               </header>

               <main className="if-main">
                    <section className="if-preview">
                         <div className="if-canvas" style={{ width: "100%", maxWidth: `${TARGET_WIDTH}px`, height: `${TARGET_HEIGHT}px` }}>
                              {src ? (
                                   <img
                                        ref={imgRef}
                                        src={src}
                                        alt="Uploaded preview"
                                        className="if-img"
                                        style={{ filter: applyFilterStyle() }}
                                   />
                              ) : (
                                   <div className="if-placeholder">
                                        <strong>No image uploaded</strong>
                                        <span>Upload a photo to preview filters</span>
                                   </div>
                              )}
                         </div>

                         <div className="if-actions">
                              <input
                                   ref={fileInputRef}
                                   id="file-input"
                                   type="file"
                                   accept="image/*"
                                   onChange={handleFile}
                                   className="if-file"
                              />

                              <label htmlFor="file-input" className="if-btn if-btn-primary">Upload Image</label>

                              <button
                                   onClick={downloadImage}
                                   disabled={!src}
                                   className={`if-btn ${src ? "if-btn-success" : "if-btn-disabled"}`}
                              >
                                   Download
                              </button>

                              <button onClick={reset} className="if-btn if-btn-ghost">Reset</button>
                         </div>
                    </section>

                    <aside className="if-controls">
                         <div className="if-control-block">
                              <label className="if-label">Selected Filter</label>
                              <div className="if-filter-list">
                                   {filterList.map((f) => (
                                        <button
                                             key={f}
                                             onClick={() => setFilterName(f)}
                                             className={`if-chip ${f === filterName ? "active" : ""}`}
                                        >
                                             {f}
                                        </button>
                                   ))}
                              </div>
                         </div>

                         <div className="if-control-block">
                              <label className="if-label">Intensity</label>
                              <input
                                   type="range"
                                   min={0}
                                   max={100}
                                   value={intensity}
                                   onChange={(e) => setIntensity(Number(e.target.value))}
                                   className="if-range"
                              />
                              <div className="if-small">{intensity}%</div>
                         </div>

                         <div className="if-control-block">
                              <label className="if-label">Quick Presets</label>
                              <div className="if-presets">
                                   <button
                                        className="if-preset"
                                        onClick={() => {
                                             setFilterName("Vintage");
                                             setIntensity(80);
                                        }}
                                   >
                                        Vintage
                                   </button>
                                   <button
                                        className="if-preset"
                                        onClick={() => {
                                             setFilterName("Cool");
                                             setIntensity(60);
                                        }}
                                   >
                                        Cool
                                   </button>
                                   <button
                                        className="if-preset"
                                        onClick={() => {
                                             setFilterName("Warm");
                                             setIntensity(40);
                                        }}
                                   >
                                        Warm
                                   </button>
                                   <button
                                        className="if-preset"
                                        onClick={() => {
                                             setFilterName("None");
                                             setIntensity(100);
                                        }}
                                   >
                                        Original
                                   </button>
                              </div>
                         </div>

                         <div className="if-tip">Tip: Pick a filter then fine-tune the intensity. On small screens controls stack below the preview.</div>
                    </aside>
               </main>

               <footer className="if-footer">
                    <div className="if-applied">Applied CSS filter: <code className="if-code">{applyFilterStyle()}</code></div>
               </footer>
          </div>
     );
}
