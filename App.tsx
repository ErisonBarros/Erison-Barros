import React, { useState, useRef } from 'react';
import { Settings, Camera, MapPin, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { TabSelector } from './components/TabSelector';
import { InputField } from './components/InputField';
import { RadioGroup } from './components/RadioGroup';
import { 
  PropertyType, 
  PropertyData, 
  QuadraStatus, 
  Topography, 
  Pavement, 
  Coverage 
} from './types';
import { submitToGoogleSheets } from './services/googleSheetsService';

const initialData: PropertyData = {
  type: PropertyType.TERRENO,
  price: '',
  phone: '',
  informantName: '',
  lotArea: '',
  builtArea: '',
  frontage: '',
  condoFee: '',
  quadraStatus: '',
  topography: '',
  floors: '',
  pavement: '',
  hasPool: '',
  isWalled: '',
  coverage: '',
  latitude: null,
  longitude: null,
  photos: []
};

function App() {
  const [currentTab, setCurrentTab] = useState<PropertyType>(PropertyType.TERRENO);
  const [formData, setFormData] = useState<PropertyData>({ ...initialData, type: PropertyType.TERRENO });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (type: PropertyType) => {
    setCurrentTab(type);
    setFormData(prev => ({ ...prev, type }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateField = (field: keyof PropertyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationCapture = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Erro ao obter localização. Verifique as permissões.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      // Limit to 3 photos total
      const totalPhotos = [...formData.photos, ...newPhotos].slice(0, 3);
      setFormData(prev => ({ ...prev, photos: totalPhotos }));
    }
  };

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.price || !formData.informantName) {
        alert("Por favor, preencha pelo menos o Preço e o Informante.");
        return;
    }

    setIsSubmitting(true);
    const success = await submitToGoogleSheets(formData);
    setIsSubmitting(false);

    if (success) {
      alert("Dados enviados com sucesso para a planilha!");
      setFormData({ ...initialData, type: currentTab }); // Reset form but keep tab
    } else {
      alert("Erro ao enviar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white px-4 py-4 flex justify-between items-center border-b border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">CARPINA</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Observatório de Valores</p>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <Settings size={20} />
        </button>
      </header>

      {/* Navigation */}
      <TabSelector current={currentTab} onChange={handleTabChange} />

      {/* Main Form */}
      <main className="px-4 py-6 max-w-lg mx-auto space-y-2">
        
        {/* Common Top Fields */}
        <InputField 
          label="Preço (R$)" 
          placeholder="Ex: 350.000,00" 
          value={formData.price}
          onChange={(e) => updateField('price', e.target.value)}
          type="text" 
          inputMode="numeric"
        />

        <div className="grid grid-cols-2 gap-4">
            <InputField 
            label="Telefone" 
            placeholder="(00) 00000-0000" 
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            type="tel"
            />
            <InputField 
            label="Informante" 
            placeholder="Nome" 
            value={formData.informantName}
            onChange={(e) => updateField('informantName', e.target.value)}
            />
        </div>

        {/* Dynamic Area Fields */}
        <div className="grid grid-cols-2 gap-4">
            <InputField 
                label="Área lote (m²)" 
                placeholder="Ex: 300" 
                value={formData.lotArea}
                onChange={(e) => updateField('lotArea', e.target.value)}
                type="number"
            />
            
            {/* Conditional Construction Area - Hide for Land */}
            {currentTab !== PropertyType.TERRENO && (
                <InputField 
                    label="Área constr. (m²)" 
                    placeholder="Ex: 80" 
                    value={formData.builtArea}
                    onChange={(e) => updateField('builtArea', e.target.value)}
                    type="number"
                />
            )}
        </div>

        <InputField 
            label="Testada (m)" 
            placeholder="Ex: 10" 
            value={formData.frontage}
            onChange={(e) => updateField('frontage', e.target.value)}
            type="number"
        />

        {/* Condo Fee - Only for Condo/Apto */}
        {currentTab === PropertyType.APTO && (
             <InputField 
                label="Taxa de Condomínio (R$)" 
                placeholder="Ex: 500,00" 
                value={formData.condoFee}
                onChange={(e) => updateField('condoFee', e.target.value)}
                type="number"
             />
        )}

        {/* Property Characteristics */}
        <div className="mt-6 space-y-4">
            <RadioGroup 
                name="quadra"
                label="Situação de Quadra"
                options={[QuadraStatus.ESQUINA, QuadraStatus.MEIO, QuadraStatus.FUNDOS]}
                value={formData.quadraStatus}
                onChange={(val) => updateField('quadraStatus', val)}
            />

            <RadioGroup 
                name="topografia"
                label="Topografia"
                options={[Topography.PLANO, Topography.ACIMA, Topography.ABAIXO, Topography.ACIDENTADO]}
                value={formData.topography}
                onChange={(val) => updateField('topography', val)}
            />

            {/* Murado - Only for Land */}
            {currentTab === PropertyType.TERRENO && (
                <RadioGroup 
                    name="murado"
                    label="Murado"
                    options={['Sim', 'Não']}
                    value={formData.isWalled}
                    onChange={(val) => updateField('isWalled', val)}
                />
            )}

            {/* Andares - Not for Land */}
            {currentTab !== PropertyType.TERRENO && (
                 <RadioGroup 
                    name="andares"
                    label="Andares"
                    options={['Térreo', 'Andares']}
                    value={formData.floors}
                    onChange={(val) => updateField('floors', val)}
                />
            )}

            <RadioGroup 
                name="pavimentacao"
                label="Pavimentação"
                options={[Pavement.SOLO, Pavement.PARALELEPIPEDO, Pavement.ASFALTO]}
                value={formData.pavement}
                onChange={(val) => updateField('pavement', val)}
            />

            {/* Pool - For House */}
            {(currentTab === PropertyType.CASA || currentTab === PropertyType.APTO) && (
                 <RadioGroup 
                    name="piscina"
                    label="Piscina"
                    options={['Sim', 'Não']}
                    value={formData.hasPool}
                    onChange={(val) => updateField('hasPool', val)}
                />
            )}

             {/* Coverage - For House/Commercial */}
             {(currentTab === PropertyType.CASA || currentTab === PropertyType.COMERCIAL) && (
                 <RadioGroup 
                    name="cobertura"
                    label="Tipo de Cobertura"
                    options={[Coverage.LAJE, Coverage.TELHADO, Coverage.OUTRO]}
                    value={formData.coverage}
                    onChange={(val) => updateField('coverage', val)}
                />
            )}
        </div>

        <hr className="my-6 border-gray-200" />

        {/* GPS Section */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">
                <MapPin className="inline w-4 h-4 mr-1 text-gray-400" /> 
                Coordenadas GPS
            </label>
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                    {formData.latitude ? (
                        <div className="text-sm text-gray-600">
                            <p>Lat: {formData.latitude.toFixed(6)}</p>
                            <p>Long: {formData.longitude.toFixed(6)}</p>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">Nenhuma localização capturada</span>
                    )}
                </div>
                <button 
                    onClick={handleLocationCapture}
                    disabled={locationLoading}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 disabled:opacity-50"
                >
                    {locationLoading ? 'Buscando...' : 'Capturar Localização'}
                </button>
            </div>
        </div>

        {/* Photo Section */}
        <div className="mb-24">
             <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">
                <Camera className="inline w-4 h-4 mr-1 text-gray-400" /> 
                Fotos do Imóvel ({formData.photos.length}/3)
            </label>
            
            <div className="flex gap-4 mb-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium flex items-center justify-center gap-2 active:bg-gray-50"
                >
                    <Camera size={18} />
                    Tirar Foto
                </button>
                <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium flex items-center justify-center gap-2 active:bg-gray-50"
                >
                    <ImageIcon size={18} />
                    Galeria
                </button>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment"
                onChange={handlePhotoUpload} 
                multiple 
                className="hidden"
            />
            
            <p className="text-xs text-gray-400 mt-1 pl-1">As fotos serão comprimidas para envio rápido.</p>

            {/* Photo Preview */}
            {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {formData.photos.map((file, idx) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                             <img 
                                src={URL.createObjectURL(file)} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                             />
                        </div>
                    ))}
                </div>
            )}
        </div>

      </main>

      {/* Sticky Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-20 safe-area-bottom">
        <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="animate-spin" /> Enviando...
                </>
            ) : (
                'Enviar para Planilha'
            )}
        </button>
      </div>

    </div>
  );
}

export default App;