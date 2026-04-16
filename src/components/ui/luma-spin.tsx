export const LumaSpin = () => {
  return (
    <div className="relative w-[65px] aspect-square">
      <span
        className="absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100"
        style={{ animation: "lumaLoaderAnim 2.5s infinite" }}
      />
      <span
        className="absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100"
        style={{
          animation: "lumaLoaderAnim 2.5s infinite",
          animationDelay: "-1.25s",
        }}
      />
      <style>{`
        @keyframes lumaLoaderAnim {
          0%    { inset: 0 35px 35px 0; }
          12.5% { inset: 0 35px 0 0; }
          25%   { inset: 35px 35px 0 0; }
          37.5% { inset: 35px 0 0 0; }
          50%   { inset: 35px 0 0 35px; }
          62.5% { inset: 0 0 0 35px; }
          75%   { inset: 0 0 35px 35px; }
          87.5% { inset: 0 0 35px 0; }
          100%  { inset: 0 35px 35px 0; }
        }
      `}</style>
    </div>
  );
};
