interface Props {
  stretchGoals: {
    goal: number;
    description: string;
  }[];
  totalAmount: number;
}

export default function ProgressBar({ stretchGoals, totalAmount }: Props) {
  const maxAmount = stretchGoals[stretchGoals.length - 1]?.goal;
  const nextGoal = stretchGoals.find(
    (stretchGoal) => stretchGoal.goal > totalAmount
  );

  return (
    <div className="flex flex-wrap items-center h-full p-2 overflow-hidden justify-evenly">
      <div
        style={{ minHeight: "300px", minWidth: "300px", maxWidth: "75%" }}
        className="flex flex-col justify-center flex-grow"
      >
        <div className="text-left">
          <p className="p-3 text-4xl">Totalt innsamlet</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative flex w-full h-20 m-1 overflow-hidden text-xs bg-regalblue rounded-3xl">
            <p className="relative flex flex-col items-center justify-center w-full h-full text-2xl text-beige">{`${totalAmount}kr av ${maxAmount}kr`}</p>
          </div>
          <div className="flex w-full text-left">
            <p className="p-3 text-4xl">Neste stretch goal: </p>
          </div>

          <div className="relative flex w-full h-20 m-1 overflow-hidden text-xs bg-indigo-400 rounded-3xl mb-5">
            <p className="flex items-center justify-center w-full h-full text-2xl text-black">
              {nextGoal
                ? `${nextGoal.description} på ${nextGoal.goal}kr`
                : "Tomt for stretchGoals :("}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
