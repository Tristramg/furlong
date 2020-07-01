const YearlyRaise = 0.015;
const PerDiem = 60;
const TrainingPerYear = 20_000;
const SocialContributions = 0.42;

// Railway convention
const YearlyHours = 1600;
const HoursPerDay = 7;

// When in the train, but not working, how many working hours are counted
const MovingTimeRatio = 0.5;
// How many hours around the journey are needed
const PreparingTime = 2;

// How many rotations can a worker doo
function rotations(journeyDuration: number): number {
  const working = Math.min(journeyDuration + PreparingTime, HoursPerDay);
  const moving = PreparingTime + journeyDuration - working;
  const workingPerRotation = (working + moving * MovingTimeRatio) * 2;

  return Math.floor(YearlyHours / workingPerRotation);
}

function workersNeeded(
  goal: number,
  journeyDuration: number,
  trainsPerYear: number
): number {
  const workersPerJourney = (journeyDuration + PreparingTime) / HoursPerDay;
  return Math.ceil(
    (goal * (workersPerJourney * trainsPerYear)) / rotations(journeyDuration)
  );
}

class Worker {
  label: string;

  yearlySalary: number;

  monthsTraining: number;

  constructor(label: string, yearySalary: number, monthsTraining: number) {
    this.label = label;
    this.yearlySalary = yearySalary;
    this.monthsTraining = monthsTraining;
  }

  generate(
    firstYear: number,
    lastYear: number,
    journeyDuration: number
  ): { [year: number]: number } {
    const training =
      (this.yearlySalary * (1 + SocialContributions) + TrainingPerYear) *
      (this.monthsTraining / 12);

    const result = {
      [firstYear - 1]: training,
    };

    let currentSalary = this.yearlySalary;
    for (let year = firstYear; year <= lastYear; year += 1) {
      const salary = currentSalary * (1 + SocialContributions);
      const perDiem = PerDiem * rotations(journeyDuration);
      result[year] = salary + perDiem;

      currentSalary *= 1 + YearlyRaise;
    }

    return result;
  }
}

export default Worker;
export { rotations, workersNeeded };
