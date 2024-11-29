import { List, ListItemButton, Box, Avatar, Typography } from "@mui/material";
import { Expense, Group, SplitExpense, User } from "@prisma/client";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

interface splitExpenseExtended extends SplitExpense {
  participant: User;
}

interface extendedExpense extends Expense {
  paidBy: User;
  debtors: Array<splitExpenseExtended>;
}

interface ExtendedGroup extends Group {
  members: User[];
  expenses: extendedExpense[];
}
interface BalanceListProps {
  group: ExtendedGroup | undefined;
}

const getBalanceColor = (balance: number) => {
  if (balance > 0) return "#2D6A4F";
  if (balance < 0) return "#D62828";
  return "#666666";
};

const getBalanceGradient = (balance: number) => {
  if (balance > 0) return "linear-gradient(45deg, #2D6A4F 30%, #40916C 90%)";
  if (balance < 0) return "linear-gradient(45deg, #D62828 30%, #F94144 90%)";
  return "linear-gradient(45deg, #666666 30%, #888888 90%)";
};

const handleShowBalanceDetails = (memberId: number, balance: number) => {
  // Here you can implement the logic to show balance details
  console.log(
    `Showing balance details for member ${memberId} with balance ${balance}`
  );
};

export default function BalanceList({ group }: BalanceListProps) {
  return (
    <List sx={{ px: 1 }}>
      {group?.members.map((member: User) => {
        const totalPaid =
          group.expenses
            .filter((expense) => expense.paidBy.id === member.id)
            .reduce((total, expense) => total + expense.value, 0) -
          group.expenses
            .filter((expense) => expense.paidBy.id === member.id)
            .reduce((total, expense) => total + (expense.valuePaid || 0), 0);

        const totalDebt = group.expenses
          .filter((expense) =>
            expense.debtors.some(
              (debtor) =>
                debtor.participantId === member.id && debtor.paid === false
            )
          )
          .map((expense) =>
            expense.debtors
              .filter(
                (debtor) =>
                  debtor.participantId === member.id && debtor.paid === false
              )
              .map((debtor) => debtor.value)
          )
          .reduce(
            (total, values) =>
              total + values.reduce((sum, value) => sum + value, 0),
            0
          );

        const balance = Number((totalPaid - totalDebt).toFixed(2));

        return (
          <ListItemButton
            key={member.id}
            onClick={() => handleShowBalanceDetails(member.id, balance)}
            sx={{
              px: 2,
              py: 1.5,
              mb: 2,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(45, 106, 79, 0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: getBalanceColor(balance),
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  flexShrink: 0,
                }}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box
                sx={{
                  width: "140px",
                  overflow: "visible",
                  textOverflow: "ellipsis",
                  whiteSpace: "noWrap",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "primary.dark",
                    maxWidth: "60px",
                  }}
                >
                  {member.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  background: getBalanceGradient(balance),
                  color: "white",
                  py: 1.5,
                  px: 2.5,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: "auto",
                  minWidth: "120px",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {balance > 0 ? (
                  <ArrowUpwardIcon fontSize="small" />
                ) : balance < 0 ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : null}
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  ${Math.abs(balance)}
                </Typography>
              </Box>
            </Box>
          </ListItemButton>
        );
      })}
    </List>
  );
}
