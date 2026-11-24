import { ImagePlus, Image, ArrowLeft, Trash2 } from 'lucide-react';

export default function PhotoLegend() {
  return (
    <aside aria-label="Légende des actions photo" className="my-4 text-sm">
      <p className="font-medium">Sous chaque photo :</p>
      <ul className="list-none space-y-2 p-0">
        <li className="flex items-center gap-2">
          <ImagePlus size={20} aria-hidden="true" /> Ajouter la photo à la fin
          du récit.
        </li>
        <li className="flex items-center gap-2">
          <Image size={20} aria-hidden="true" /> Choisir la couverture de
          l’article (icône encadrée si sélectionnée).
        </li>
        <li className="flex items-center gap-2">
          <ArrowLeft size={20} aria-hidden="true" /> Déplacer d’une place vers
          le début de la galerie.
        </li>
        <li className="flex items-center gap-2">
          <Trash2 size={20} aria-hidden="true" /> Retirer de la galerie et de la
          couverture éventuelle. Le fichier et les insertions dans le récit sont
          conservés.
        </li>
      </ul>
    </aside>
  );
}
