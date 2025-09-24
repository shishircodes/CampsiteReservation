declare module "@lexical/react/LexicalErrorBoundary" {
  import * as React from "react";
  // Keep it simple: treat the export as a standard React component
  const LexicalErrorBoundary: React.ComponentType<React.PropsWithChildren<{}>>;
  export default LexicalErrorBoundary;
}