import snellyImage from "@/assets/snelly-character.png";

interface SnellyProps {
  isSpeaking?: boolean;
}

const Snelly = ({ isSpeaking = false }: SnellyProps) => {
  return (
    <div className={`fixed bottom-6 left-6 w-36 h-36 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4 border-primary/20 ${isSpeaking ? 'animate-bounce scale-110 border-primary' : 'scale-100'}`}>
      <img 
        src={snellyImage}
        alt="Snelly el caracol narrador"
        className={`w-full h-full object-contain transition-transform duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}
      />
    </div>
  );
};

export default Snelly;
