import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassDetails, Subject, User } from "@/types";
import { CrudFilter, useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

const ClassList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  const subjectFilter: CrudFilter[] =
    selectedSubject === "all"
      ? []
      : [{ field: "subject", operator: "eq" as const, value: selectedSubject }];

  const teacherFilter: CrudFilter[] =
    selectedTeacher === "all"
      ? []
      : [{ field: "teacher", operator: "eq" as const, value: selectedTeacher }];

  const searchFilter: CrudFilter[] = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectsQuery?.data?.data || [];
  const teachers = teachersQuery?.data?.data || [];

  const classTable = useTable<ClassDetails>({
    columns: useMemo<ColumnDef<ClassDetails>[]>(
      () => [
        {
          id: "bannerUrl",
          accessorKey: "bannerUrl",
          size: 96,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue, row }) => {
            const bannerUrl = getValue<string | undefined>();
            const className = row.original.name;

            return bannerUrl ? (
              <img
                src={bannerUrl}
                alt={className}
                className="h-12 w-20 rounded-md object-cover"
              />
            ) : (
              <div className="h-12 w-20 rounded-md bg-muted" />
            );
          },
        },
        {
          id: "name",
          accessorKey: "name",
          size: 220,
          header: () => <p className="column-title ml-2">Class Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
        },
        {
          id: "status",
          accessorKey: "status",
          size: 120,
          header: () => <p className="column-title ml-2">Status</p>,
          cell: ({ getValue }) => {
            const status = getValue<string>();
            const variant =
              status === "active"
                ? "default"
                : status === "inactive"
                ? "secondary"
                : "outline";

            return <Badge variant={variant}>{status}</Badge>;
          },
        },
        {
          id: "subject",
          accessorKey: "subject.name",
          size: 180,
          header: () => <p className="column-title ml-2">Subject</p>,
          cell: ({ row }) => (
            <span className="text-foreground">
              {row.original.subject?.name || "-"}
            </span>
          ),
        },
        {
          id: "teacher",
          accessorKey: "teacher.name",
          size: 180,
          header: () => <p className="column-title ml-2">Teacher</p>,
          cell: ({ row }) => (
            <span className="text-foreground">
              {row.original.teacher?.name || "-"}
            </span>
          ),
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 110,
          header: () => <p className="column-title ml-2">Capacity</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<number>()}</span>
          ),
        },
        {
          id: "details",
          size: 140,
          header: () => <p className="column-title">Details</p>,
          cell: ({ row }) => (
            <ShowButton
              resource="classes"
              recordItemId={row.original.id}
              variant="outline"
            >
              View
            </ShowButton>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilter, ...subjectFilter, ...teacherFilter],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Classes</h1>
      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by class name ..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  );
};

export default ClassList;
