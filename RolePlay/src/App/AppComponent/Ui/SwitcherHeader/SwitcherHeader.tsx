interface IProps {
    options: string[];
    setPageState: (state: string) => void;
    currentState: string;
}

import './SwitcherHeader.css';

export const SwitcherHeader = (props: IProps) => {    
    return (
        <div className="switcher-header">
            {props.options.map((option, index) => (
                <span 
                    key={index}
                    onClick={() => props.setPageState(option)}
                    className={`switcher-option ${
                        props.currentState === option ? 'switcher-option-active' : ''
                    }`}
                >
                    {option}
                </span>
            ))}

            <div className={'switcher-header-line'}/>
        </div>
    );
};