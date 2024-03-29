import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  changeDoneStorage,
  clearAsyncStorage,
  deleteStorage,
  getStorage,
  setStorage,
} from "../utils/storage";

import { Tasks } from "../components/Tasks";

import { AntDesign } from "@expo/vector-icons";

interface TasksProps {
  id: number;
  title: string;
  done: boolean;
}

export const Home: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taksCount, setTaksCount] = useState(0);
  const [tasks, setTasks] = useState([] as TasksProps[]);

  const getTasks = async () => {
    const data = await getStorage("tasks");
    if (data) {
      setTasks(data);
      setTaksCount(data.length);
    }
  };

  const handleAddTask = async () => {
    if (newTaskTitle === "") return;
    const newTask = {
      id: taksCount,
      title: newTaskTitle,
      done: false,
    };
    await setStorage("tasks", newTask);
    setNewTaskTitle("");
    getTasks();
  };

  const handleDone = async (id: number) => {
    await changeDoneStorage(id);
    getTasks();
  };

  const handleEditTask = async (id: number, title: string) => {
    setNewTaskTitle(title);
    await deleteStorage(id);
    getTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteStorage(id);
    getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.bgHeader}></View>
        <View style={styles.textHeader}>
          <TouchableOpacity
            onPress={async () => {
              await clearAsyncStorage();
              getTasks();
            }}
          >
            <Text style={styles.logo}>to.do</Text>
          </TouchableOpacity>

          <Text style={styles.textTasksHeader}>
            Você tem{" "}
            <Text style={styles.textTasksCountHeader}>{taksCount} tarefas</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputContent}
            placeholder="Adicionar novo todo"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <TouchableOpacity
            style={styles.inputIcon}
            onPress={() => handleAddTask()}
          >
            <AntDesign name="arrowright" size={20} color="#505050" />
          </TouchableOpacity>
        </View>
      </View>
      {tasks.length == 0 ? (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>Seu aplicativo</Text>
          <Text style={styles.noTasksText}>favorito de afazeres</Text>
        </View>
      ) : (
        <View style={styles.tasksContainer}>
          {tasks.map((task) => (
            <Tasks
              key={task.id}
              id={task.id}
              title={task.title}
              done={task.done}
              handleDone={handleDone}
              handleDelete={handleDelete}
              handleEditTask={handleEditTask}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECEC",
  },
  bgHeader: {
    backgroundColor: "#442F74",
    height: 135,
    width: "120%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  header: {
    paddingHorizontal: 30,
    gap: 30,
  },
  textHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    color: "#FFF",
    fontFamily: "Roboto",
    fontSize: 30,
    fontWeight: "bold",
  },
  textTasksHeader: {
    color: "#FFF",
    fontSize: 14,
  },
  textTasksCountHeader: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "#FFF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 5,
  },
  inputContent: {
    width: "90%",
    height: "90%",
  },
  inputIcon: {
    height: "90%",
    width: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tasksContainer: {
    marginTop: 50,
  },
  noTasksContainer: {
    height: 250,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  noTasksText: {
    color: "#505050",
    fontSize: 20,
    fontWeight: "bold",
  },
});
