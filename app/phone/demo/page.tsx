import CommunicationSimulator from "../../simulator/CommunicationSimulator";

export const metadata = {
  title: "Phone Simulator | Amplify",
  description: "Choose a phrase in the simulated Amplify companion app and watch it appear on the communication board.",
};

export default function PhoneDemoPage() {
  return <CommunicationSimulator phoneMode />;
}
