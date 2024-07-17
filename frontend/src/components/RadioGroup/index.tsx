'use client';

type RadioGroupProps = {
    id: string;
    textOn: string;
    textOff: string;
    isOn: boolean;
    onChange: Function;
}

export function RadioGroup(props: RadioGroupProps) {

    const RADIO_ON = "radioOn" + props.id;
    const RADIO_OFF = "radioOff" + props.id;

    function onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        props.onChange({ target: { id: props.id, value: evt.target.id === RADIO_ON } });
    }

    return (
        <div className="flex flex-wrap lg:w-6/12">
            <div className="flex flex-wrap bg-white w-full border-2 border-gray-50 rounded-lg tex-gray-900">
                <div className="w-full lg:w-6/12">
                    <div className="flex items-center pl-3">
                        <input
                            type="radio"
                            id={RADIO_ON}
                            checked={props.isOn}
                            onChange={onChange}
                            name={props.id}
                            className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
                            />
                        <label htmlFor={RADIO_ON} className="w-full py-3 ml-2 text-sm font-medium text-gray-900">{props.textOn || "On"}</label>
                    </div>
                </div>

                <div className="w-full lg:w-6/12">
                    <div className="flex items-center pl-3">
                        <input
                            type="radio"
                            id={RADIO_OFF}
                            checked={!props.isOn}
                            onChange={onChange}
                            name={props.id}
                            className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 focus:ring-2"
                            />
                        <label htmlFor={RADIO_OFF} className="w-full py-3 ml-2 text-sm font-medium text-gray-900">{props.textOff || "Off"}</label>
                    </div>
                </div>
            </div>
        </div>
    )
}