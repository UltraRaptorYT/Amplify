import PhoneCommunicationApp from "../../simulator/PhoneCommunicationApp";

export const metadata = {
  title: "Amplify Phone App | Communication Simulator",
  description: "A simulated phone communication board that sends chosen phrases to the Amplify demo page.",
};

export default function DemoPhonePage() {
  return <PhoneCommunicationApp />;
}
