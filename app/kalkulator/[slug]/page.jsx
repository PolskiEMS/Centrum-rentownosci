import ProfitabilityCalculator from "../../../components/calculators/ProfitabilityCalculator";

export default async function CalculatorPage({ params }) {
  const { slug } = await params;
  return <ProfitabilityCalculator slug={slug} />;
}
