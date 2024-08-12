import { OpenAI } from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openAIProcess = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export const analyzeContract = async (
  contract: string,
  setResults: any,
  setLoading: any,
) => {
  setLoading(true);
  let auditResults;
  try {
    const chatCompletion = (await openAIProcess?.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Your role and goal is to be an AI Smart Contract Auditor. You need to focus on the process of contract. Your job is to perform an audit on the given smart contract. Here is the smart contract: ${contract}.
    
        Please provide the results in the following array format for easy front-end display:
             [
             {
            "section": "Audit Report",
            "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
              },
             {
            "section": "Metric Scores",
            "details": [
             {
                "metric": "Code Quality",
                "score": 0-100
              },
             {
                "metric": "Performance",
                "score": 0-100
              },

             {
                "metric": "Security",
                "score": 0-100
              },
              {
                "metric": "Gas Efficiency",
                "score": 0-100
              },
              {
                "metric": "Key Areas of Contract Vulnerabilities",
                "score": 0-100
              },
              {
                "metric": "Documentation",
                "score": 0-100
              }
            ]
          },
          {
            "section": "Suggestions for Improvement",
            "details": "Suggestions for improving the smart contract in terms of security, code performance, documentation and any other identified weaknesses."
          }
        ]
        
        Thank you.`,
        },
      ],
      model: "gpt-3.5-turbo",
    })) as any;

    try {
      auditResults = JSON.parse(chatCompletion.choices[0].message.content);
    } catch (jsonError) {
      console.error("JSON parsing failed, displaying raw content:", jsonError);
      auditResults = chatCompletion.choices[0].message.content;
    }

    setResults(auditResults);
  } catch (apiError) {
    console.error("API call failed:", apiError);
    auditResults = "Error processing your request.";
    setResults(auditResults);
  } finally {
    setLoading(false);
  }
  return auditResults;
};

export const fixIssues = async (
  contract: string,
  suggestions: string,
  setContract: (contract: string) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);

  const response = (await openAIProcess.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Here is the smart contract with the following issues: ${suggestions}. Please provide a fixed version of the contract:\n\n${contract}`,
      },
    ],
    model: "gpt-3.5-turbo",
  })) as any;

  const fixedContract = response.choices[0].message.content;
  setContract("Some updates is here: " + fixedContract.trim());
  setLoading(false);


  return fixedContract;
};
