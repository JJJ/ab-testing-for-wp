// @flow

function convertRatio(p: number, c: number) {
  return p === 0 ? 0 : c / p;
}

function getCRSE(p: number, c: number) {
  const cr = convertRatio(p, c);
  return [
    cr,
    (cr * (1 - cr) / p) ** 0.5,
  ];
}

function findWinner(results: ABTestResult[]) {
  return results
    .find((result) => {
      const cr = convertRatio(result.participants, result.conversions);
      return results.every(item => convertRatio(item.participants, item.conversions) <= cr);
    });
}

function calcTestWinner(control: string, results: ABTestResult[]) {
  const winner = findWinner(results);

  if (!winner) return null;

  const controlVariant = winner.id === control
    ? findWinner(results.filter(result => result.id !== control))
    : results.find(result => result.id === control);

  if (!controlVariant) throw new Error('Control variant of test cannot be found.');

  const [crc, sea] = getCRSE(controlVariant.participants, controlVariant.conversions);
  const [crr, ser] = getCRSE(winner.participants, winner.conversions);

  const sed = ((sea ** 2) + (ser ** 2)) ** 0.5;
  const zScore = (crr - crc) / sed;
  const minScore = 1.96;

  return {
    winner,
    confident: zScore > minScore,
  };
}

export default calcTestWinner;
