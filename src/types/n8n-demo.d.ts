declare namespace JSX {
  interface IntrinsicElements {
    'n8n-demo': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      workflow?: string;
      src?: string;
      height?: string | number;
      width?: string | number;
      hidecanvaserrors?: string;
      clicktointeract?: string;
      frame?: string;
      collapseformobile?: string;
    };
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'n8n-demo': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        workflow?: string;
        src?: string;
        height?: string | number;
        width?: string | number;
        hidecanvaserrors?: string;
        clicktointeract?: string;
        frame?: string;
        collapseformobile?: string;
      };
    }
  }
} 