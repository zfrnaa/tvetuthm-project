import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Table, Row, Rows } from "react-native-table-component";
import { ChevronDown, ChevronUp, Star } from "lucide-react-native";
import { starDescriptions, tableKluster, tableCIPP, headerKluster, headerCIPP } from "../model/information";


const RuangMaklumat = () => {

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-semibold mb-8">Butiran Penilaian Bintang</Text>

      <View className="w-full max-w-3xl p-8 bg-white/50 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-md mb-8">
        {starDescriptions.map(({ stars, text, description }, index) => (
          <View key={text} className="mb-4">
            <TouchableOpacity onPress={() => toggleExpand(index)} className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <View className="flex flex-row">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="text-yellow-400" fill={'orange'} color={'lightorange'} />
                  ))}
                </View>
                <Text className="ml-4 text-lg">{text}</Text>
              </View>
              {expandedIndex === index ? (
                <ChevronUp className="text-gray-500" />
              ) : (
                <ChevronDown className="text-gray-500" />
              )}
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text className="ml-2 mt-2 text-gray-700 text-justify text-base">{description}</Text>
            )}
          </View>
        ))}
      </View>

      <Text className="text-2xl font-semibold mb-8">Skor Mengikut Kluster</Text>

      <View className="w-full max-w-lg p-4 bg-white/50 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-md">
        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
          <Row data={headerKluster.map(col => col.label)} style={{ height: 40, backgroundColor: '#f1f8ff'}} />
          <Rows data={tableKluster.map(row => [row.component, row.score, row.percentage])} textStyle={{ margin: 6 }} />
        </Table>
      </View>
      <Text className="text-2xl font-semibold mb-8 mt-8">Skor Mengikut CIPP</Text>

      <View className="w-full max-w-lg p-4 bg-white/50 backdrop-blur-md shadow-blue-100 rounded-2xl shadow-md">
        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
          <Row data={headerCIPP.map(col => col.label)} style={{ height: 40, backgroundColor: '#f1f8ff' }} />
          <Rows data={tableCIPP.map(row => [row.component, row.score, row.percentage])} textStyle={{ margin: 6 }} />
        </Table>
      </View>
    </View>
  )
}

export default RuangMaklumat