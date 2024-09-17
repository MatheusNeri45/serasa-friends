import { Suspense } from 'react'
import { headers } from 'next/headers'

export default async function ExpensesList() {
  const auth = headers().get('authorization')
  const expenseList = await fetch("http://localhost:3000/api/getUserExpenses", {headers:{'Authorization':auth || ''}});
  const listItems = expenseList.map(: Object =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );
}
