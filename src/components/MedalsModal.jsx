import React from 'react';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';

function MedalsModal({ userId, triggerRefresh }) {

  const handleOpenVitrina = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const historial = data || [];
      const totalListones = historial.length;

      // Agrupar semanas por Mes-Año para calcular las Copas
      const gruposPorMes = {};
      historial.forEach((r) => {
        const llave = `${r.challenge_month}-${r.challenge_year}`;
        gruposPorMes[llave] = (gruposPorMes[llave] || 0) + 1;
      });

      let totalCopitas = 0;
      Object.values(gruposPorMes).forEach((cantSemanas) => {
        if (cantSemanas >= 4) totalCopitas++;
      });

      // Preparar strings visuales
      const listonesVisuales = totalListones > 0 
        ? Array(totalListones).fill('🎗️').join(' ') 
        : '<span style="color:#999;">Ninguno todavía</span>';

      const copitasVisuales = totalCopitas > 0 
        ? Array(totalCopitas).fill('🏆').join(' ') 
        : '<span style="color:#999;">Ninguna todavía (Junta 4 listones en un mes)</span>';

      Swal.fire({
        title: '🏆 Mi Vitrina de Logros',
        html: `
          <div style="text-align: left; background: #f7fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <h5 style="margin: 0 0 5px 0; color:#4a5568;">Listones Semanales (${totalListones}):</h5>
              <div style="font-size: 1.5rem; letter-spacing: 4px;">${listonesVisuales}</div>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;"/>
            <div>
              <h5 style="margin: 0 0 5px 0; color:#d69e2e;">Copas Mensuales (${totalCopitas}):</h5>
              <div style="font-size: 1.8rem; letter-spacing: 4px;">${copitasVisuales}</div>
            </div>
          </div>
        `,
        confirmButtonText: 'Seguir coleccionando',
        target: document.body
      });

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      className="btn-view-toggle"
      onClick={handleOpenVitrina}
      style={{ background: 'linear-gradient(135deg, #a0aec0, #718096)', fontWeight: 'bold' }}
    >
      🏅 Ver Medallas
    </button>
  );
}

export default MedalsModal;