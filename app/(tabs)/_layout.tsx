/**
 * Componente que define la navegación por pestañas (tabs) de la aplicación.
 * Utiliza el sistema de pestañas de Expo Router y personaliza colores e íconos.
 */

import { Tabs } from 'expo-router';        // Componente de navegación por pestañas de Expo Router
import { Ionicons } from '@expo/vector-icons'; // Librería de íconos (requiere @expo/vector-icons instalado)
import Colors from '../../constants/colors';   // Paleta de colores centralizada (colores.ts)

/**
 * Layout principal de las pestañas.
 * Define dos pestañas: "Cursos" (listado) y "Perfil" (datos del usuario).
 */
export default function TabsLayout() {
  return (
    <Tabs
      // Opciones comunes para todas las pestañas (estilo de la barra, colores, header)
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,   // Color del ícono cuando la pestaña está activa (morado)
        tabBarInactiveTintColor: Colors.gray,    // Color del ícono cuando la pestaña está inactiva (gris)
        headerStyle: { backgroundColor: Colors.primary }, // Fondo del header (coincide con el color primario)
        headerTintColor: '#fff',                 // Color del texto del header (blanco para contraste)
      }}
    >
      {/* Pestaña 1: Listado de cursos */}
      <Tabs.Screen
        name="index"                // Nombre del archivo en la carpeta (app/(tabs)/index.tsx)
        options={{
          title: 'Cursos',                       // Título que aparece en el header
          tabBarIcon: ({ color }) => (           // Ícono que se muestra en la barra de pestañas
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />

      {/* Pestaña 2: Perfil del usuario */}
      <Tabs.Screen
        name="perfil"               // Archivo correspondiente: app/(tabs)/perfil.tsx
        options={{
          title: 'Perfil',                       // Título del header
          tabBarIcon: ({ color }) => (           // Ícono de persona
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
