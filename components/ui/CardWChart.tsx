import { MoveDiagonal, PanelBottomCloseIcon } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import  Modal from "react-native-modal";

interface CardProps {
  title: string;
  content: string;
  subtitle?: string;
  icon: React.JSX.Element;
  graph?: React.JSX.Element;
  modalContent?: React.ReactNode;
}

const screenWidth = Dimensions.get("window").width;

const CardWChart: React.FC<CardProps> = ({ title, content, subtitle, icon, graph, modalContent }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex flex-column p-4 bg-white/50 backdrop-blur-md rounded-2xl min-w-[200px] max-w-[400px] min-h-[200px] max-h-[300px]">
      <View className="flex flex-row justify-between mb-4">
        {/* Left Section: Icon and Title */}
        <View className="flex-row items-center space-x-4">
          <View className="justify-center items-center bg-blue-100 rounded-full p-2" style={styles.roundshape}>
            {React.cloneElement(icon, { color: "#344BFD", fill: "#344BFD", size: 24 })}
          </View>
          <View>
            {(() => {
              const words = title.split(' ');
              const lastWord = words.pop() || '';
              const remainingWords = words.join(' ');

              if (lastWord.length >= 2) {
                return (
                  <View style={{ width: '100%' }}>
                    <Text className="text-lg font-semibold max-w-1/3 font-geistSansMedium" style={{ color: '#575757' }}>
                      {remainingWords + "\n" + lastWord}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <Text className="text-lg font-semibold max-w-1/3" style={{ color: '#575757' }}>
                    {title}
                  </Text>
                );
              }
            })()}
          </View>
        </View>

        {/* Right Section: Outlined Icon (Click to Open Modal) */}
        <TouchableOpacity onPress={() => setModalVisible(true)} >
          <View style={styles.roundshape_outlined} className="justify-center items-center">
            <MoveDiagonal size={18} />
          </View>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row items-end">
        <View className="flex-1 flex-column justify-end">
          <Text className="text-lg font-medium text-gray-600">{subtitle}</Text>
          <Text className="text-3xl font-bold text-blue-600">{content}</Text>
        </View>
        <View className="flex-2 items-end">
          {graph}
        </View>
      </View>

      {/* Modal Overlay */}
      <Modal
        isVisible={modalVisible} // ✅ Uses isVisible instead of visible
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        style={styles.fullscreenContainer}
        onBackdropPress={() => setModalVisible(false)} // Close when clicking outside
        onBackButtonPress={() => setModalVisible(false)} // Close on back press (Android)
      >
        <View style={styles.modalSpace}>
          {/* Close Button */}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <PanelBottomCloseIcon size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-700">Details</Text>
          <View style={styles.modalBody}>{modalContent}</View>
        </View>
      </Modal>
    </View >
  );
};

const styles = StyleSheet.create({
  roundshape: {
    backgroundColor: '#C4DDFF',
    height: 44, //any of height
    width: 44, //any of width
    justifyContent: "center",
    borderRadius: 44 / 2  // it will be height/2
  },
  roundshape_outlined: {
    borderColor: '#e4e4e4',
    borderWidth: 2,
    height: 38, //any of height
    width: 38, //any of width
    justifyContent: "center",
    borderRadius: 38 / 2  // it will be height/2
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingInline: 26
  },
  modalSpace: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
    flex: 1,
    flexDirection: "column",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    marginTop: 20,
    backgroundColor: "#344BFD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center"
  }

});

export default CardWChart;