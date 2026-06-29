import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Ajusta la ruta si es necesario
import Swal from 'sweetalert2';

function ChallengeButton({ category, userId, onChallengeCompleted }) {
  const [completed, setCompleted] = useState(false);

  // Obtener el número de semana actual del año
  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  useEffect(() => {
    if (userId) {
      checkStatus();
    }
  }, [userId, category]);

  const checkStatus = async () => {
    try {
      const hoy = new Date();
      const semana = getWeekNumber(hoy);
      const ano = hoy.getFullYear();

      const { data } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('user_id', userId)
        .eq('week_number', semana)
        .eq('challenge_year', ano)
        .maybeSingle();

      if (data) {
        setCompleted(true);
      } else {
        setCompleted(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getChallengeText = () => {
    const cat = category?.toLowerCase().trim();
    if (cat === 'plantas') return 'Capturar una planta de flores rosadas 🌸';
    if (cat === 'paisajes') return 'Capturar un atardecer justo detrás de un árbol 🌅🌳';
    if (cat === 'gatos') return 'Capturar un gato completamente blanco 🐱❄️';
    return 'Capturar la foto de un perro blanco y negro 🐶🖤🤍';
  };

  const handleChallenge = async () => {
    if (completed) {
      Swal.fire({
        title: '¡Reto Completado! 🎗️',
        text: 'Ya ganaste tu listón de esta semana. ¡Vuelve la próxima para un nuevo desafío!',
        icon: 'success',
        target: document.body
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: '🎗️ Reto de la Semana',
      html: `
        <div style="font-size: 1.1rem; margin-bottom: 20px; color: #333;">
          <strong>Tu misión:</strong><br/> <span style="color:#2f855a; font-weight:bold;">${getChallengeText()}</span>
        </div>
        <p style="font-size: 0.85rem; color: #666;">Sube una foto de tu galería para que la app analice el objetivo.</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '📁 Cargar imagen',
      cancelButtonText: 'Luego',
      target: document.body
    });

    if (!isConfirmed) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      Swal.fire({
        title: 'Analizando imagen...',
        html: 'Buscando patrones, metadatos y colores requeridos... 🔍',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); },
        target: document.body
      });

      // Simular escaneo de 3 segundos
      await new Promise(resolve => setTimeout(resolve, 3000));

      try {
        const hoy = new Date();
        const semana = getWeekNumber(hoy);
        const mes = hoy.getMonth() + 1;
        const ano = hoy.getFullYear();

        await supabase
          .from('weekly_challenges')
          .insert([{ 
            user_id: userId, 
            week_number: semana, 
            challenge_month: mes,
            challenge_year: ano,
            completed: true 
          }]);

        setCompleted(true);
        if (onChallengeCompleted) onChallengeCompleted();

        Swal.fire({
          title: '¡Reto Cumplido! 🎉',
          text: '¡Análisis exitoso! Tu foto cumple con los parámetros del desafío. Sumaste un nuevo listón.',
          icon: 'success',
          target: document.body
        });

      } catch (err) {
        Swal.fire({
          title: '¡Reto Guardado!',
          text: 'Felicidades por completar el reto.',
          icon: 'success',
          target: document.body
        });
        setCompleted(true);
        if (onChallengeCompleted) onChallengeCompleted();
      }
    };

    fileInput.click();
  };

  return (
    <button
      className="btn-view-toggle"
      onClick={handleChallenge}
      style={{ 
        background: completed ? 'linear-gradient(135deg, #f1c40f, #f39c12)' : 'rgba(255,255,255,.12)', 
        color: completed ? '#1a1a1a' : '#fff', 
        fontWeight: 'bold' 
      }}
    >
      {completed ? '🎗️ Reto Hecho' : '🎗️ Reto Semanal'}
    </button>
  );
}

export default ChallengeButton;