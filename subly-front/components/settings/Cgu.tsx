import React from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

const Cgu = () => {
  const router = useRouter();
  const data = [
    {
      title: '1. INTRODUCTION',
      content:
        'Subly accorde une importance primordiale à la protection de votre vie privée. Cette politique de confidentialité vise à vous informer de nos pratiques concernant la gestion de vos données.',
    },
    {
      title: '2. STOCKAGE LOCAL DES DONNÉES',
      content:
        "Notre application a été conçue avec le principe de confidentialité dès la conception privacy by design. Toutes les données que vous saisissez dans l'application sont exclusivement stockées localement sur votre appareil. Nous n'avons accès à aucune de vos données personnelles et ne collectons aucune information sur nos serveurs.",
    },
    {
      title: '3. DONNÉES STOCKÉES LOCALEMENT',
      content: `Les données suivantes sont stockées uniquement sur votre appareil : 
• Informations sur vos mouvements (noms, dates, montants)
• Préférences utilisateur (thème, langue, devise)
• Ces données restent sous votre contrôle exclusif
• Elles sont supprimées définitivement si vous désinstallez l'application`,
    },
    {
      title: '4. ABSENCE DE COLLECTE DE DONNÉES',
      content: `Nous ne collectons pas :
• De données personnelles
• De données d'utilisation
• De données de géolocalisation
• De cookies ou identifiants publicitaires
• De données techniques sur votre appareil`,
    },
    {
      title: '5. SÉCURITÉ',
      content: `Bien que nous ne stockions aucune donnée sur nos serveurs, nous vous recommandons de :
• Protéger l'accès à votre appareil par un code ou une authentification biométrique
• Effectuer régulièrement des sauvegardes de votre appareil
• Maintenir votre système d'exploitation à jour`,
    },
    {
      title: '6. VOS DROITS',
      content: `Puisque toutes les données restent sur votre appareil :
• Vous gardez le contrôle total de vos données
• Vous pouvez les modifier ou les supprimer à tout moment via l'application
• La suppression de l'application entraîne la suppression définitive de toutes les données associées`,
    },
    {
      title: '7. MODIFICATIONS DE LA POLITIQUE',
      content:
        'Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication dans lapplication.',
    },
    {
      title: '8. NOUS CONTACTER',
      content:
        'Pour toute question concernant cette politique de confidentialité, contactez-nous via le formulaire de contact disponible dans lapplication.',
    },
    {
      title: '9. PERMISSIONS DE LAPPLICATION',
      content: `Notre application peut demander les permissions suivantes sur votre appareil :
• Stockage: pour sauvegarder vos données localement
• Photos: pour personnaliser les photos de vos mouvements localement
• Ces permissions sont uniquement utilisées pour le fonctionnement local de l'application`,
    },
    {
      title: '10. STOCKAGE ET SAUVEGARDE',
      content: `• Les données sont stockées uniquement dans la mémoire locale de votre appareil
• Nous n'avons aucun moyen de récupérer vos données en cas de perte ou de suppression`,
    },
  ];
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center">
        <Button title="Retour" onPress={() => router.back()} />
      </View>
      <ScrollView className="p-5">
        <Text className="text-white text-[24px] font-bold text-center mb-10">
          POLITIQUE DE CONFIDENTIALITÉ
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
