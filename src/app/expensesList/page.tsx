import { headers } from "next/headers";
interface expenseItem {
  id: number;
  value: number;
  expenseId: number;
  participantId: number;
  updatedAt: string;
  status: boolean;
}

export default async function ExpensesList() {
  const auth = headers().get("userId")|| "3";
  let res = await fetch("http://localhost:3000/api/getUserExpenses", {
    headers: { userId: auth },
  });
  let resList = await res.json();
  let expenseList = resList.expenseFound
  console.log(expenseList)
  if (!Array.isArray(expenseList)) {
    expenseList = [];
  }
  return (
    <ul>
      {expenseList.map((expenseItem: expenseItem) => (
        <li key={expenseItem.id}> {expenseItem.value}</li>
      ))}
    </ul>
  );
}
