// Algoritmo para crear el folio y código de barras
  

  function generarFolio(identificadorElectronico) {
    const folioPrefix = "A" + identificadorElectronico.slice(0, 2);
    const folioSuffix = identificadorElectronico.slice(-7);
    const folio = `${folioPrefix} ${folioSuffix}`;
    return folio;
  }
  
  function generarCodigoBarras(identificadorElectronico) {
    const codigoBarras = `A${identificadorElectronico.slice(0, 2)}${identificadorElectronico.slice(-7)}`;
    return codigoBarras;
  }
  
  module.exports = {
    generarFolio,
    generarCodigoBarras
  };
  