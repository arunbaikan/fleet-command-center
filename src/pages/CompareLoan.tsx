import { useEffect, useState } from "react";
import { lenders, Lender } from "@/Data/lenders";
import { LenderCard } from "@/components/LenderCard";
import { ComparisonTable } from "@/components/ComparisionTable";
import { DetailedComparison } from "@/components/DetailedComparison";
import { PreSanctionLetter } from "@/components/PreSanctionLetter";
import { ProvisionalOfferLetter } from "@/components/ProvisionalOfferLetter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FunnyLoader from "@/components/CompareLoanPageLoader";
import {
  LayoutGrid,
  Table,
  ArrowRight,
  X,
  Shield,
  Zap,
  Award,
  FileText,
  GitCompare,
} from "lucide-react";
import React from "react";
import { fetchEligibleLoanProducts } from "@/api/api";

type ViewMode = "grid" | "table";
type Stage = "compare" | "detailed" | "letter" | "psl";
type MainTab = "compare" | "psl";

const CompareLonePage = () => {
  const [selectedLoanType, setSelectedLoanType] = useState("personal");
  const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [stage, setStage] = useState<Stage>("compare");
  const [mainTab, setMainTab] = useState<MainTab>("compare");
  const [selectedForLetter, setSelectedForLetter] = useState<Lender | null>(
    null,
  );
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleSelectLender = (id: string) => {
    if (selectedLenders.includes(id)) {
      setSelectedLenders(selectedLenders.filter((l) => l !== id));
    } else if (selectedLenders.length < 2) {
      setSelectedLenders([...selectedLenders, id]);
    }
  };

  const handleCompare = () => {
    if (selectedLenders.length === 2) {
      setStage("detailed");
    }
  };

  const handleSelectForLetter = (lender: Lender) => {
    setSelectedForLetter(lender);
    setStage("letter");
  };

  const handleApplyNow = (lender: Lender) => {
    setSelectedForLetter(lender);
    setStage("letter");
  };

  const handleBackToCompare = () => {
    setStage("compare");
    setSelectedForLetter(null);
  };

  const handleBackToDetailed = () => {
    setStage("detailed");
    setSelectedForLetter(null);
  };

  const handleOpenPSL = () => {
    setStage("psl");
  };

  const handleClosePSL = () => {
    setStage("compare");
  };

  const handleFetchEligibleLoans = async () => {
    try {
      setLoading(true);
      const resp = await fetchEligibleLoanProducts();
      console.log("response", resp);
      const banks = resp.data.banks.map((bank) => {
        const {
          bankId,
          bankName,
          eligible,
          approvalProbability,
          interestRate,
          maximumEligibleLoanAmount,
          processingFee,
          disbursal,
          tenureOptions,
        } = bank;
        return {
          id: bankId,
          name: bankName,
          logo: bankId,
          type: "Bank",
          maxSanctionAmount: maximumEligibleLoanAmount,
          trueAPR: interestRate,
          trueAPRMax: interestRate,
          tenureOptions: tenureOptions || "12-84 months",
          processingFee: processingFee,
          processingFeeMin: 0.5,
          processingFeeMax: 1.5,
          approvalProbability: approvalProbability,
          prepaymentCharges: "2% after 12 EMIs",
          disbursalTime: disbursal,
          pros: [
            "Fastest approval",
            "Lowest APR for existing customers",
            "Flexible EMI options",
          ],
          cons: [
            "Strict eligibility criteria",
            "Higher processing fee for new customers",
          ],
          uniqueAdvantages: [
            "Zero foreclosure after 12 months for salaried",
            "Top-up loan facility",
          ],
          restrictions: ["Minimum income ₹25,000/month", "Age: 21-60 years"],
        };
      });
      setLenders(banks);
      // console.log("resp", resp);
    } catch (error) {
      console.log("Error in fetching products", error);
    } finally {
        setLoading(false);
    }
  };
  useEffect(() => {
    handleFetchEligibleLoans();
  }, []);

  const selectedLenderObjects = lenders.filter((l) =>
    selectedLenders.includes(l.id),
  );
  console.log("Lenders", lenders);
  return (   
    <div className="min-h-screen justify-center bg-background">
      {/* Hero Section */}
      {/* <header className="relative bg-gradient-to-br from-[#1a132f] via-[#2a1f4a] to-[#3b2a63] text-white py-24 mt-19">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              Trusted by 50,000+ borrowers
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Compare Loans.
              <br />
              <span className="text-white">Save Thousands.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Compare offers from 10+ top banks & NBFCs. Get the best rates,
              fastest approval, and lowest fees.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2 text-white/90">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Instant comparison</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Pre-approval in minutes</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span>100% secure</span>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="flex justify-center">
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-10 md:py-14">
          {/* Main Tabs - Only show when not in detailed/letter views */}
          {/* {(stage === "compare" || stage === "psl") && (
            <div className="flex justify-center mb-8">
              <div className="flex bg-gray-100 rounded-2xl p-1 shadow-sm">
                <button
                  onClick={() => setStage("compare")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                    stage === "compare"
                      ? "bg-white text-black shadow-md"
                      : "text-gray-500 hover:text-black",
                  )}
                >
                  <GitCompare className="w-4 h-4" />
                  Compare Lenders
                </button>
                <button
                  onClick={handleOpenPSL}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                    stage === "psl"
                      ? "bg-white text-black shadow-md"
                      : "text-gray-500 hover:text-black",
                  )}
                >
                  <FileText className="w-4 h-4" />
                  Provisional Offer Letter
                </button>
              </div>
            </div>
          )} */}
          {stage === "compare" && (
            <div className="animate-fade-in">
              {/* View Toggle & Selection Info */}
              <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 mt-15">
                <div className="flex items-center gap-3">
                  <h2 className="!text-2xl !font-bold text-gray-900">
                    Compare {lenders.length} Lenders
                  </h2>
                  {selectedLenders.length > 0 && (
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {selectedLenders.length}/2 selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {/* Grid / Table Toggle */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-500 hover:text-gray-900",
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        viewMode === "table"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-500 hover:text-gray-900",
                      )}
                    >
                      <Table className="w-4 h-4" />
                      Table
                    </button>
                  </div>
                  {/* Compare Button */}
                  {selectedLenders.length === 2 && (
                    <Button
                      onClick={handleCompare}
                      className="
              bg-gradient-to-r from-violet-500 to-purple-500
              hover:from-violet-600 hover:to-purple-600
              text-white font-semibold
              px-6 h-11 !rounded-xl
              shadow-md hover:shadow-lg
              transition-all duration-200
              flex items-center gap-2
            "
                    >
                      Compare Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </section>
              {/* Selected Lenders Chips */}
              {selectedLenders.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 ">
                  {selectedLenderObjects.map((lender) => (
                    <div
                      key={lender.id}
                      className="inline-flex items-center gap-2 bg-trust-light text-trust px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-600"
                    >
                      {lender.name}
                      <button
                        onClick={() => handleSelectLender(lender.id)}
                        className="hover:bg-trust/20 rounded-full p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Lenders Display */}
                {loading ? (
                  <div className="flex justify-center py-16">
                    <FunnyLoader />
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {lenders.map((lender) => (
                      <LenderCard
                        key={lender.id}
                        lender={lender}
                        isSelected={selectedLenders.includes(lender.id)}
                        onSelect={handleSelectLender}
                        disabled={
                          selectedLenders.length >= 2 &&
                          !selectedLenders.includes(lender.id)
                        }
                        onApplyNow={handleApplyNow}
                      />
                    ))}
                  </div>
                ) : (
                <div className="card-elevated overflow-hidden">
                  <ComparisonTable
                    lenders={lenders}
                    selectedLenders={selectedLenders}
                    onSelectLender={handleSelectLender}
                    onApplyNow={handleApplyNow}
                  />
                </div>
              )}
              {/* Help Text */}
              <p className="text-center text-muted-foreground text-sm mt-8">
                Select any 2 lenders to compare, or click "Apply Now" to get a
                pre-sanction letter directly
              </p>
            </div>
          )}
          {stage === "psl" && (
            <ProvisionalOfferLetter
              onClose={handleClosePSL}
              onApplyNow={handleApplyNow}
            />
          )}
          {stage === "detailed" && selectedLenderObjects.length === 2 && (
            <div>
              <Button
                variant="ghost"
                onClick={handleBackToCompare}
                className="mb-6             !rounded-xl
              text-gray-500
              transition-all
              hover:bg-purple-600
              hover:text-white
              hover:shadow-md"
              >
                ← Back to all lenders
              </Button>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
                Side-by-Side Comparison
              </h2>
              <DetailedComparison
                lender1={selectedLenderObjects[0]}
                lender2={selectedLenderObjects[1]}
                onSelectForLetter={handleSelectForLetter}
              />
            </div>
          )}
          {stage === "letter" && selectedForLetter && (
            <PreSanctionLetter
              lender={selectedForLetter}
              loanType={selectedLoanType}
              onBack={handleBackToCompare}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-navy text-primary-foreground/70 py-10">
        <div className="container max-w-6xl text-center">
          <p className="text-sm">
            © 2026 Happirate. All loan offers are subject to lender terms and
            conditions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompareLonePage;
