import styles from "./page.module.css";
import ExpensesList from "./expensesList/page";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ExpensesList />

        <footer className={styles.ctas}>
          <a
            className={styles.primary}
            href="http://localhost:3000/">
               Summary
          </a>
          <a
            href="http://localhost:3000/addExpense"
            className={styles.secondary}
          >
            +
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.secondary}
          >
            History
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.secondary}
          >
            Profile
          </a>
        </footer>
      </main>
    </div>
  );
}
