import { waitForReact, ReactSelector } from 'testcafe-react-selectors';
import { Selector, ClientFunction } from 'testcafe'; 
import { getMetamask } from 'testcafe-browser-provider-dappeteer';

const default_mmemo = 'stumble story behind hurt patient ball whisper art swift tongue ice alien';

// Just wait to resolve a promise
const wait = ms => new Promise((r, j)=> setTimeout(r, ms))

fixture `Sign up page`
    .page `http://localhost:3000`
    .beforeEach(async function(t) {
      await waitForReact();
      const metamask = await getMetamask(t);
      // Import default mmemonic
      try {
        await metamask.lock()  // If user is not created, it will throw here, creating a new imported seed account
        console.log("Unlocking account")
        await metamask.unlock();
      } catch (_error) {
        console.log("Creating an account...")
        await metamask.importAccount(default_mmemo);
      }
      // Change network to private blockchain
      console.log("Changing to localhost network...");
      await metamask.switchNetwork('localhost 8545');
    });


test('Does it render ? Hello Shasta!', async t => {
    const h1 = ReactSelector('Requeriments__WelcomeBox h1');
    await wait(5000);
    await t.expect(h1.innerText).eql('Welcome to Shasta');
});

test('Are we in the correct network?', async t => {
  const networkChecker = ReactSelector('NetworkStatus');
  const networkCheckerText = ReactSelector('NetworkStatus__NetworkSegment Segment div');
  await t.expect(networkCheckerText.innerText, 'Private');
});

/*
test('Mint Sha with Metamask', async t => {
  const h1 = ReactSelector('Requeriments__WelcomeBox h1');
  const claimButton = await ReactSelector('Claim__ClaimButton');
  const metamask = await getMetamask(t);
  // Click open popup button
  await claimButton.click();
  // Wait popup to appear

  // Click on Metamask to confirm transaction
  // await metamask.confirmTransaction()
});
*/