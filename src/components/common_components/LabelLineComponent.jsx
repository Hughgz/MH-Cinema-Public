import { LabelItem } from "./comom_item/LabelItem";
import PropTypes from 'prop-types';

const LabelLineComponent = ({ labeLineTitle = "", labelList = [] }) => {
    return (
        <div className="flex flex-nowrap items-center text-sm">
            <span className="inline-block mt-2 py-[6px] text-grey-40 min-w-[70px]">
                {labeLineTitle}:
            </span>
            <ul className="ml-2 flex flex-wrap gap-1 flex-1">
                {labelList.map((labelName, index) => (
                    <LabelItem key={index} labelName={labelName} />
                ))}
            </ul>
        </div>
    );
};

LabelLineComponent.propTypes = {
    labeLineTitle: PropTypes.string,
    labelList: PropTypes.arrayOf(PropTypes.string),
}

export default LabelLineComponent;
