import { ImageSourcePropType } from "react-native";
import imageIndex from "../../../assets/imageIndex";

interface Slidse {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
}
  export interface Slide {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
}

const slides: Slidse[] = [
    {
        id: '1',
        title: 'Ready to Start?',
        description: 'Sign in or create an account to unlock all features!',
        image: imageIndex.onBag,
    },
    {
        id: '2',
        title: 'Ready to Start?',
        description: 'Sign in or create an account to unlock all features!',
        image: imageIndex.onBag,
    },
    {
        id: '3',
        title: 'Ready to Start?',
        description: 'Sign in or create an account to unlock all features!',
        image: imageIndex.onBag,
    },
 

]; 
export default slides