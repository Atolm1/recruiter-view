// Small line icons that sit beside text. Decorative: the text beside
// each one carries the meaning, so they are hidden from screen readers.
function Icon({ children, size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

export const QuestionIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.2-2.4 3.8" />
    <path d="M12 17h.01" />
  </Icon>
);

export const AlertIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </Icon>
);
