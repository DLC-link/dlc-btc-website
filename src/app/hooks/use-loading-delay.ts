// import { useEffect, useState } from "react";

// export const useLoadingDelay = (delay = 3000): boolean => {
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoaded(true);
//     }, delay);

//     return () => clearTimeout(timer);
//   }, [delay]);

//   return isLoaded;
// };
