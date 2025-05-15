import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  TableContainer,
  useColorModeValue,
  Link,
  Badge,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import api from "@/services/axios/api";
import useColorModeStyles from "@/utils/useColorModeStyles";

interface User {
  username: string;
  email: string;
  views: number;
  age: number;
  gender: "male" | "female" | "other" | string;
  location: string;
}

const ListeUsers: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>("/api/v1/list-users/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "views",
        header: "Profile Views",
        cell: (info) => info.getValue().toLocaleString(),
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: (info) => {
          const gender = info.getValue();
          let colorScheme = "gray";

          if (gender === "male") colorScheme = "blue";
          else if (gender === "female") colorScheme = "pink";
          else if (gender === "other") colorScheme = "purple";

          return (
            <Badge colorScheme={colorScheme} textTransform="capitalize">
              {gender}
            </Badge>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: (info) => info.getValue(),
      },
      {
        id: "actions",
        header: "Action",
        cell: (info) => (
          <Link
            href={`/admin/users/modify/${info.row.original.username}`}
            _hover={{ textDecoration: "none" }}
          >
            <Badge colorScheme="blue">Modifier</Badge>
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { bg, textColor, bgColor, thBg, borderColor } = useColorModeStyles();

  return (
    <div className="container">
      <Box
        className="header"
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
        border="solid 1px"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Liste des utilisateurs
        </Text>
      </Box>

      <Box className="wide admin-register">
        <TableContainer
          bg={bgColor}
          borderRadius="lg"
          boxShadow="base"
          overflowX="auto"
        >
          {loading ? (
            <Box textAlign="center" py={10}>
              <Spinner size="lg" />
            </Box>
          ) : (
            <Table variant="simple">
              <Thead bg={thBg}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isSorted = header.column.getIsSorted();
                      return (
                        <Th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          cursor="pointer"
                          color={textColor}
                          borderColor={borderColor}
                        >
                          <Box display="flex" alignItems="center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {isSorted === "asc" && (
                              <TriangleUpIcon ml={1} boxSize={3} />
                            )}
                            {isSorted === "desc" && (
                              <TriangleDownIcon ml={1} boxSize={3} />
                            )}
                          </Box>
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} color={textColor}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </div>
  );
};

export default ListeUsers;
