"use client";
import { useState, useEffect, Fragment } from "react";
import { SplitExpense, User, Expense } from "@prisma/client";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditSelectPayer from "@/app/_components/editSelectPayer/editSelectPayer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface extendedExpenseSplits extends SplitExpense {
  participant: { name: string; id: number };
}

import {
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  Typography,
} from "@mui/material";

interface formProps {
  setUpdateList: Function;
  setSelectedExpenseSplits: Function;
  selectedExpenseSplits: extendedExpenseSplits[];
  groupId: number;
  payer: number | undefined;
  selectedExpense: Expense;
  setEditing: Function;
}

export default function EditExpenseForms({
  setUpdateList,
  selectedExpenseSplits,
  setSelectedExpenseSplits,
  payer,
  selectedExpense,
  setEditing,
}: formProps) {
  const [debtorsExpense, setdDebtorsExpense] = useState<
    extendedExpenseSplits[]
  >([]);
  const [payerExpense, setPayerExpense] =
    useState<extendedExpenseSplits | null>();

  useEffect(() => {
    const payerSplitExpense = selectedExpenseSplits.filter(
      (expenseSplit: extendedExpenseSplits) => {
        return expenseSplit.participantId === payer;
      }
    )[0];
    setPayerExpense(payerSplitExpense);
    setdDebtorsExpense(
      selectedExpenseSplits.filter((expenseSplit: extendedExpenseSplits) => {
        return expenseSplit.participantId !== payer;
      })
    );
  }, []);

  const fetchUpdate = async (data: object) => {
    const response = await fetch("../api/updateExpenseEdit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
  };
  const onSetPayer = (
    expenseSplit: extendedExpenseSplits | undefined | null
  ) => {
    if (expenseSplit) {
      setdDebtorsExpense((prev) =>
        prev.filter((debtor) => debtor.id !== expenseSplit.participantId)
      );
      setPayerExpense(expenseSplit);
    }
  };

  const onAddToDebtorList = (
    payerExpense: extendedExpenseSplits | undefined | null
  ) => {
    let counter = 0;
    if (payerExpense) {
      debtorsExpense.forEach((debtor) => {
        if (debtor.participantId === payerExpense.participantId) {
          counter++;
        }
      });
      if (counter >= 1) {
        setPayerExpense(null);
      } else {
        setdDebtorsExpense([...debtorsExpense, payerExpense]);
        setPayerExpense(null);
      }
    }
  };

  const onCancel = () => {
    setdDebtorsExpense([]);
    setPayerExpense(null);
    setEditing(false);
  };
  const onConfirm = () =>
    // selectedExpense: Expense,
    // payerExpense: extendedExpenseSplits | null | undefined,
    // splitExpense: extendedExpenseSplits[]
    {
      const data = {
        payerExpense: payerExpense,
        selectedExpense: selectedExpense,
        splitExpense: selectedExpenseSplits,
      };
      const response = fetchUpdate(data)
        .then((response) => response.json())
        .then((res) => {
          console.log(res.splitExpense);
          setSelectedExpenseSplits(res.splitExpense);
          setUpdateList((prev: boolean) => !prev);
          setdDebtorsExpense([]);
          setPayerExpense(null);
          setEditing(false);
        });
    };
  return (
    <Fragment>
      <TableContainer
        style={{ marginBottom: 30 }}
        component={Paper}
        sx={{ maxWidth: 650 }}
      >
        <Table sx={{ maxWidth: 600 }} aria-label="simple table">
          <TableBody>
            <TableRow
              key={payerExpense?.participant.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">Payer</TableCell>
              <TableCell align="center" component="th" scope="row">
                {payerExpense?.participant.name}
              </TableCell>
              <TableCell align="center">R$ {payerExpense?.value}</TableCell>

              {payerExpense && (
                <TableCell align="center">
                  <KeyboardArrowDownIcon
                    onClick={() => onAddToDebtorList(payerExpense)}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(128,128,128,0.1)",
                      },
                    }}
                  ></KeyboardArrowDownIcon>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer
        style={{ marginBottom: 20 }}
        component={Paper}
        sx={{ maxWidth: 650 }}
      >
        <Table sx={{ maxWidth: 600 }} aria-label="simple table">
          <TableBody>
            {debtorsExpense.map((expenseSplit: extendedExpenseSplits) => (
              <TableRow
                key={expenseSplit.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">Debtor</TableCell>
                <TableCell align="center" component="th" scope="row">
                  {expenseSplit.participant.name}
                </TableCell>
                <TableCell align="center">R$ {expenseSplit.value}</TableCell>
                <TableCell align="center">
                  <KeyboardArrowUpIcon
                    onClick={() => onSetPayer(expenseSplit)}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(128,128,128,0.1)",
                      },
                    }}
                  ></KeyboardArrowUpIcon>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Button variant="contained" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Fragment>
  );
}
