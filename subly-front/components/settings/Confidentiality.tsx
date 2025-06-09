import React from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

const Confidentiality = () => {
  const router = useRouter();
  const data = [
    {
      title: '1. Données collectées',
      content: `Subly collecte uniquement les données nécessaires à son fonctionnement :
- Identifiants (email, mot de passe crypté),
- Données saisies dans l’application : dépenses, revenus, dates, catégories, etc.`,
    },
    {
      title: '2. Utilisation des données',
      content: `Les données sont utilisées uniquement pour :
- Fournir les fonctionnalités de suivi financier,
- Générer des graphiques et des statistiques personnalisées.

Elles ne sont jamais revendues, partagées ou commercialisées.`,
    },
    {
      title: '3. Stockage et sécurité',
      content: `Les données sont stockées dans une base de données sécurisée, hébergée sur un serveur distant (Railway). Des mesures techniques sont mises en œuvre pour éviter les accès non autorisés.`,
    },
    {
      title: '4. Droits de l’utilisateur',
      content: `Conformément au RGPD, vous avez :
- Un droit d’accès à vos données,
- Un droit de rectification,
- Un droit de suppression.

Pour exercer ces droits, vous pouvez contacter : contactsubly@gmail.com`,
    },
    {
      title: '5. Cookies',
      content:
        'Subly n’utilise pas de cookies tiers ou de traçage publicitaire.',
    },
    {
      title: '6. Durée de conservation',
      content:
        'Les données sont conservées tant que le compte est actif. En cas de suppression de compte, toutes les données sont supprimées définitivement.',
    },
    {
      title: '7. Contact',
      content:
        'Pour toute question relative à la protection de vos données personnelles, vous pouvez contacter : contactsubly@gmail.com',
    },
  ];
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center">
        <Button title="Retour" onPress={() => router.back()} />
      </View>
      <ScrollView className="p-5">
        <Text className="text-white text-[24px] font-bold text-center mb-10">
          Ploitique de confidentialité
        </Text>
        <View className="flex-column gap-5">
          {data.map((item, index) => (
            <View key={index} className="flex-column gap-2">
              <Text className="text-white text-[18px] font-bold">
                {item.title}
              </Text>
              <Text className="text-white text-[16px]">{item.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Confidentiality;
