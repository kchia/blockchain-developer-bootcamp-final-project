import { useWeb3React } from "@web3-react/core";

import { Auth, MintEllipticalArtForm } from "../../features";

export default function HomePage() {
  const { active } = useWeb3React();

  let content;
  if (active) {
    content = (
      <>
        <MintEllipticalArtForm />
      </>
    );
  }

  return (
    <section>
      <h2>Create unique, one-of-a-kind elliptical art</h2>
      <Auth />
      {content}
    </section>
  );
}
