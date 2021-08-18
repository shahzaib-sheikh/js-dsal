import { AhoCorasick } from '../algorithms/ahocorasick';
test('Aho Corasick', () => {
  
  let ahoCorasick = new AhoCorasick();

  ahoCorasick.build([
    "a",
    "ab",
    "bc",
    "aab",
    "aac",
    "bd"
  ]);

  console.log(ahoCorasick.match("bcaab"));

  // console.log(ahoCorasick);
  // expect(Greeter('Carl')).toBe('Hello Carl');
});

test("Hacker rank Aho corasick", ()=>{

})