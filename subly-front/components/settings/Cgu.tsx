import React from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

const Cgu = () => {
  const router = useRouter();
  const data = [
    {
      title: '1. Objet',
      content:
        'Les présentes Conditions Générales d’Utilisation (ci-après « CGU ») régissent l’accès et l’utilisation de l’application mobile Subly, éditée à titre personnel par un développeur dans un cadre universitaire.',
    },
    {
      title: '2. Accès à l’Application',
      content:
        'L’accès à l’application Subly est gratuit. Pour utiliser les fonctionnalités, l’utilisateur doit créer un compte avec un email valide et un mot de passe sécurisé. L’utilisateur est responsable de la confidentialité de ses identifiants.',
    },
    {
      title: '3. Fonctionnalités',
      content: `Subly permet à l’utilisateur de :
- Suivre ses dépenses et revenus récurrents,
- Catégoriser ses transactions,
- Visualiser des statistiques mensuelles,
- Consulter un calendrier de ses événements financiers.`,
    },
    {
      title: '4. Obligations de l’utilisateur',
      content: `L’utilisateur s’engage à :
- Fournir des informations exactes,
- Ne pas utiliser l’application à des fins frauduleuses ou illégales,
- Ne pas tenter de perturber le bon fonctionnement de l’application.`,
    },
    {
      title: '5. Propriété intellectuelle',
      content: `Tous les éléments de l’application (textes, interfaces, logos, code, etc.) sont protégés. Toute reproduction ou distribution sans autorisation est interdite.`,
    },
    {
      title: '6. Responsabilité',
      content: `Subly est une application en développement et est fournie « telle quelle ». Aucun engagement de performance, d’exactitude ou de disponibilité permanente n’est garanti. L’éditeur décline toute responsabilité en cas de perte de données ou d’erreurs liées à l’usage.`,
    },
    {
      title: '7. Modification des CGU',
      content:
        'L’éditeur se réserve le droit de modifier les CGU à tout moment. En cas de modification, l’utilisateur sera informé lors de sa prochaine connexion.',
    },
    {
      title: '8. Résiliation',
      content:
        'L’utilisateur peut supprimer son compte à tout moment depuis l’application. L’éditeur peut également suspendre un compte en cas de non-respect des CGU.',
    },
  ];
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center">
        <Button title="Retour" onPress={() => router.back()} />
      </View>
      <ScrollView className="p-5">
        <Text className="text-white text-[24px] font-bold text-center mb-10">
          Conditions générales d'utilisation
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

export default Cgu;
