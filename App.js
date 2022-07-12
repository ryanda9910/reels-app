import { useState, useEffect } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

/* openDB */
function openDatabase() {
	const db = SQLite.openDatabase("db.db");
	return db;
}

const db = openDatabase();

function Items({ done: doneHeading, onPressItem }) {
	const [items, setItems] = useState(null);

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				`select * from items where done = ?;`,
				[doneHeading ? 1 : 0],
				(_, { rows: { _array } }) => setItems(_array)
			);
		});
	}, []);

	const heading = doneHeading ? "Completed" : "Todo";

	if (items === null || items.length === 0) {
		return null;
	}

	return (
		<View style={styles.sectionContainer}>
			<Text style={styles.sectionHeading}>{heading}</Text>
			{items.map(({ id, done, value }) => (
				<View
					key={id}
					style={{
						backgroundColor: done ? "#1c9963" : "silver",
						borderColor: "#000",
						borderWidth: 1,
						padding: 8,
						borderRadius: 8,
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Text
						style={{
							color: done ? "#fff" : "#000",
							marginVertical: 3,
							fontWeight: "bold",
						}}
					>
						{value}
					</Text>

					{done ? (
						<TouchableOpacity
							style={{ backgroundColor: "red", padding: 5, borderRadius: 8 }}
							onPress={() => onPressItem && onPressItem(id)}
						>
							<Text style={{ color: "white" }}>Delete</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={{
								backgroundColor: "#1c9963",
								padding: 5,
								borderRadius: 8,
							}}
							onPress={() => onPressItem && onPressItem(id)}
						>
							<Text style={{ color: "white" }}>Check</Text>
						</TouchableOpacity>
					)}
				</View>
			))}
		</View>
	);
}

export default function App() {
	const [text, setText] = useState(null);
	const [forceUpdate, forceUpdateId] = useForceUpdate();

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				"create table if not exists items (id integer primary key not null, done int, value text);"
			);
		});
	}, []);

	const add = (text) => {
		// is text empty?
		if (text === null || text === "") {
			return false;
		}

		db.transaction(
			(tx) => {
				tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
			},
			null,
			forceUpdate
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>📝 Note App </Text>
			<>
				<View style={styles.flexRow}>
					<TextInput
						onChangeText={(text) => setText(text)}
						onSubmitEditing={() => {
							add(text);
							setText(null);
						}}
						placeholder="what do you need to do?"
						placeholderTextColor={"white"}
						style={styles.input}
						value={text}
					/>
				</View>
				<ScrollView style={styles.listArea}>
					<Items
						key={`forceupdate-todo-${forceUpdateId}`}
						done={false}
						onPressItem={(id) =>
							db.transaction(
								(tx) => {
									tx.executeSql(`update items set done = 1 where id = ?;`, [
										id,
									]);
								},
								null,
								forceUpdate
							)
						}
					/>
					<Items
						done
						key={`forceupdate-done-${forceUpdateId}`}
						onPressItem={(id) =>
							db.transaction(
								(tx) => {
									tx.executeSql(`delete from items where id = ?;`, [id]);
								},
								null,
								forceUpdate
							)
						}
					/>
				</ScrollView>
			</>
		</View>
	);
}

function useForceUpdate() {
	const [value, setValue] = useState(0);
	return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#242c40",
		flex: 1,
		paddingTop: Constants.statusBarHeight,
	},
	heading: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
	},
	flexRow: {
		flexDirection: "row",
	},
	input: {
		borderColor: "#4630eb",
		borderRadius: 4,
		borderWidth: 1,
		color: "white",
		flex: 1,
		height: 48,
		margin: 16,
		padding: 8,
	},
	listArea: {
		backgroundColor: "#242c40",
		flex: 1,
		paddingTop: 16,
	},
	sectionContainer: {
		marginBottom: 16,
		backgroundColor: "#242c40",
		marginHorizontal: 16,
	},
	sectionHeading: {
		fontSize: 18,
		color: "white",
		fontWeight: "700",
		backgroundColor: "#242c40",
		marginBottom: 8,
	},
});
