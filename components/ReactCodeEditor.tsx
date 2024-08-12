import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-solidity";
import "prismjs/themes/prism-tomorrow.css";
import { ArrowRight, PaperclipIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

type ReactCodeEditorProps = {
  contract: string;
  setContract: React.Dispatch<React.SetStateAction<string>>;
  analyze: () => Promise<void>;
};

const PrismHighlight = (code: string) => {
  return Prism.highlight(code, Prism.languages.solidity, "solidity");
};

const isSolidityContract = (code: string) => {
  const SPDXRegex = /\/\/\s*SPDX-License-Identifier:\s*[^\s]+/;
  const pragmaRegex = /pragma\s+solidity\s+[^;]+;/;
  return SPDXRegex.test(code) && pragmaRegex.test(code);
};

const ReactCodeEditor = ({
  contract,
  setContract,
  analyze,
}: ReactCodeEditorProps) => {
  const handleAnalyze = () => {
    if (!isSolidityContract(contract)) {
      toast({
        title: "Error",
        description: "Invalid Solidity code",
        variant: "destructive",
      });
      return;
    }

    analyze();
  };
  return (
    <div className="relative lg:w-4/6 w-full mx-auto">
      <div
        className="border outline-none border-r-2 border-gray-500 rounded-2xl p-6 bg-neutral-950 text-neutral-200"
        style={{ height: "450px", overflowY: "auto" }}>
        <Editor
          value={contract}
          onValueChange={(code) => setContract(code)}
          highlight={(code) => PrismHighlight(code)}
          padding={15}
          placeholder="Paste your Solidity code here..."
          textareaId="code-editor"
          textareaClassName="outline-none"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: "14px",
            minHeight: "100%",
            background: "transparent",
            color: "inherit",
          }}
        />
      </div>
      <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-neutral-900">
        <div className="flex justify-end items-center">
          <div className="flex justify-end items-center cursor-pointer group">
            <Button type="button" variant="outline" onClick={handleAnalyze}>
              <span className="text-foreground font-extrabold">Analyze</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactCodeEditor;
