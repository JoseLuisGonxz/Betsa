document.getElementById('btnDescargarPDF').addEventListener('click', () => {
    fetch('/descargar-pdf')
      .then(response => {
        if (response.ok) {
          // Obtén el nombre del archivo desde la cabecera "Content-Disposition"
          const contentDisposition = response.headers.get('content-disposition');
          const match = contentDisposition.match(/filename="(.+)"/);
          const fileName = match ? match[1] : 'archivo.pdf'; // Nombre predeterminado si no se puede obtener del encabezado
          return response.blob().then(blob => ({ fileName, blob }));
        } else {
          throw new Error('Error al descargar el archivo');
        }
      })
      .then(({ fileName, blob }) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // Establece el nombre de descarga como el nombre del archivo obtenido
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.log('Error al descargar el archivo:', error);
      });
  });