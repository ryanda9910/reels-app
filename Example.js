import {
	Animated,
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
} from "react-native";
import React, { useState } from "react";

export default function App() {
	const [animation] = useState(new Animated.Value(250));
	const [alreadyPress, setPress] = useState(false);

	const handlePress = () => {
		setPress(true);
		Animated.spring(animation, {
			toValue: 450,
			duration: 20000000,
			friction: 1,
			tension: 5,
			useNativeDriver: true,
		}).start();
	};

	const normalPress = () => {
		setPress(false);
		Animated.spring(animation, {
			toValue: 250,
			duration: 20000000,
			friction: 1,
			tension: 5,
			useNativeDriver: true,
		}).start();
	};

	const trans = {
		transform: [{ translateY: animation }],
	};
	return (
		<View style={{ backgroundColor: "#242c40", flex: 1 }}>
			<Animated.View style={[styles.ball, trans]} />
			<View style={{ position: "absolute", bottom: 10, alignSelf: "center" }}>
				<TouchableOpacity
					onPress={!alreadyPress ? handlePress : normalPress}
					style={styles.button}
				>
					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							paddingVertical: 15,
							textAlign: "center",
						}}
					>
						Bounce It
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	ball: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "yellow",
		alignSelf: "center",
	},
	button: {
		width: 150,
		height: 70,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#4630eb",
		marginVertical: 50,
	},
	container: {
		alignItems: "center",
	},
});
