export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 220 60"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="30" cy="30" r="10" fill="#4F46E5" />
            <circle cx="10" cy="30" r="4" fill="#14B8A6" />
            <circle cx="30" cy="10" r="4" fill="#14B8A6" />
            <circle cx="50" cy="30" r="4" fill="#14B8A6" />
            <circle cx="30" cy="50" r="4" fill="#14B8A6" />
            <line x1="30" y1="30" x2="10" y2="30" stroke="#4F46E5" strokeWidth="2" />
            <line x1="30" y1="30" x2="30" y2="10" stroke="#4F46E5" strokeWidth="2" />
            <line x1="30" y1="30" x2="50" y2="30" stroke="#4F46E5" strokeWidth="2" />
            <line x1="30" y1="30" x2="30" y2="50" stroke="#4F46E5" strokeWidth="2" />
            <text x="70" y="38" fontFamily="Poppins, Arial" fontSize="24" fill="#1F2933">
                Servi<tspan fontWeight="700">Hub</tspan>
            </text>
        </svg>
    );
}
