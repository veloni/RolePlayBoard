interface IProps {
    parameters: {
        [key: string]: Array<{
            [key: string]: any;
        }>;
    };
    options: string[];
}

import { SwitcherHeader } from "../SwitcherHeader/SwitcherHeader";
import { useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import './Parameters.css';

let timeOut = null;

const throttle = (callBack) => {
    if (timeOut) {
        clearTimeout(timeOut);
    }

    timeOut = setTimeout(() => {
    callBack();
    timeOut = null;
    }, 1000);
}

export const Parameters = (props: IProps) => {
    const [pageState, setPageState] = useState(props.options[0]);

    useEffect(() => {
        return () => {
            if (timeOut) {
                clearTimeout(timeOut);
            }
        }
    }, []);

    const currentParameters = useMemo(() => {
        const curr = props.parameters[pageState];
        
        if (Array.isArray(curr)) {
            return curr;
        }

        return Object.entries(curr).flat().flat();
    }, [pageState]);

    useEffect(() => {
        clearTimeout(timeOut);
        setSearchValue('');
        setTrueSearchValue('');
    }, [pageState]);

    const [searchValue, setSearchValue] = useState('');
    const [trueSearchValue, setTrueSearchValue] = useState('');

    const onChange = (value) => {
        setSearchValue(value);
        throttle(() => setTrueSearchValue(value));
    }

    return (
        <div className="parameters">
            <div className="parameters__header">
                <SwitcherHeader 
                    options={props.options} 
                    setPageState={setPageState} 
                    currentState={pageState}
                />

                <input 
                    className="parameters__search"
                    value={searchValue} 
                    onChange={(e) => onChange(e.target.value)} 
                    placeholder={'Поиск'}
                />
            </div>

            <div className="parameters__body"> 

            {currentParameters.map((item, index) => {
                if (typeof item === 'string') {
                    const searchValueToLower = trueSearchValue.toLowerCase();

                    if (trueSearchValue !== '' && !item.toLowerCase().includes(searchValueToLower)) {
                        return null;
                    }
                    return (
                        <div key={index} className="parameter-item">
                        <div className="parameter-row">
                            <span className="parameter-value">
                            <Highlighter
                                highlightClassName="YourHighlightClass"
                                searchWords={[searchValue]}
                                autoEscape={true}
                                textToHighlight={item}
                            />
                            </span>
                        </div>
                        </div>
                    )
                }

                const output = [];

                let hasParameters = false;

                Object.entries(item).forEach(([key, value]) => {
                        const newValue = typeof value === 'object' 
                            ? JSON.stringify(value) 
                            : String(value);

                        const searchValueToLower = trueSearchValue.toLowerCase();
                        output.push({key: key, newValue: newValue});

                        if (trueSearchValue !== '' && !newValue.toLowerCase().includes(searchValueToLower)) {
                            return;
                        }

                        hasParameters = true;
                    });
                

                if (output.length === 0 || hasParameters === false) {
                    return null;
                }

                return (
                     <div key={index} className="parameter-item">
                        {output.map((item) => {
    
                        return (
                        <div key={item.key} className="parameter-row">
                        <span className="parameter-key">{item.key}:</span>
                        <span className="parameter-value">
                        <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[searchValue]}
                            autoEscape={true}
                            textToHighlight={item.newValue}
                        />
                        </span>
                        </div>)
                    })}
                    </div>
                )
            } )}
            </div>
        </div>
    );
};