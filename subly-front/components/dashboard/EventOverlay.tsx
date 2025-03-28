import React, { useEffect, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, TouchableWithoutFeedback, View } from 'react-native'

interface EventOverlayProps {
    isVisible: boolean
    onClose: () => void
}
const EventOverlay = ({isVisible, onClose}: EventOverlayProps) => {
    const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    if (isVisible) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Réinitialisation quand invisible
      fadeAnim.setValue(0)
      slideAnim.setValue(0)
    }
  }, [isVisible])

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0], // Départ depuis le bas (500) jusqu'à position finale (0)
  })

  const handleClose = () => {
    // Animation de sortie
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose() // Appelé après la fin de l'animation
    })
  }

  if (!isVisible) return null

  return (
    <Animated.View 
    className="absolute inset-0"
    style={{ opacity: fadeAnim }}
  >
    {/* Fond semi-transparent cliquable */}
    <TouchableWithoutFeedback onPress={handleClose}>
      <View className="flex-1 bg-black bg-opacity-50" />
    </TouchableWithoutFeedback>

    {/* Contenu du modal */}
    <Animated.View 
      className="absolute bottom-0 w-full bg-red-900 rounded-t-3xl p-6"
      style={{ 
        transform: [{ translateY }],
        maxHeight: '80%' // Limite à 80% de la hauteur
      }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <SafeAreaView>
          <TextInput 
            className='text-white bg-red-800 p-4 mb-4 rounded-lg text-base'
            placeholder="Titre de l'événement"
            placeholderTextColor="#ddd"
          />
          <TextInput 
            inputMode='numeric'
            className='text-white bg-red-800 p-4 rounded-lg text-base'
            placeholder="Montant"
            placeholderTextColor="#ddd"
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Animated.View>
  </Animated.View>
  )
}

export default EventOverlay