import Image from 'next/image';

export default function StartGuideCard({
    title,
    description,
    imageSrc,
    visible,
    delay,
}: {
    title: string;
    description: string;
    imageSrc: string;
    visible: boolean;
    delay: number;
}) {
    return (
        <div
            style={{
                transitionDelay: `${delay}ms`,
            }}
            className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-700 transform p-6 flex flex-col items-center text-center
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
        >
            <div className="w-36 h-36 mb-6 relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-contain rounded-xl"
                />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
    );
}
